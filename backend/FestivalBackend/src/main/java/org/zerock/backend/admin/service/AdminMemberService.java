package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.AdminMemberDto;
import org.zerock.backend.entity.Booth;
import org.zerock.backend.entity.Reservation;
import org.zerock.backend.entity.UserEntity;
import org.zerock.backend.repository.*;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminMemberService {

    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;
    private final ReservationRepository reservationRepository;
    private final PostRepository postRepository;
    private final BoothRepository boothRepository;

    // 1. 전체 회원 목록 조회
    @Transactional(readOnly = true)
    public List<AdminMemberDto.Summary> getMemberList() {
        // 이름순 정렬
        List<UserEntity> users = userRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
        
        return users.stream()
                .map(AdminMemberDto.Summary::from)
                .collect(Collectors.toList());
    }

    

    // 2. 회원 상태 변경 (활성/비활성)
    @Transactional
    public void changeMemberStatus(String userId, boolean isActive) {
    UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
            
    user.setActive(isActive); 
    // Dirty Checking에 의해 트랜잭션 종료 시 자동 update 쿼리 나감
    }

    // 3. 회원 강제 삭제 (관리자 권한)
    public void forceDeleteMember(String userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        // [중요] 삭제 전, 회원이 예약했던 부스 인원 복구 (UserService 로직과 동일)
        try {
            List<Reservation> reservations = reservationRepository.findAll(); // 유저 ID로 조회하는 메서드가 있다면 그걸 쓰세요.
            
            // 성능을 위해 Repository에 findByUser_UserId 메서드가 있다면 그걸 쓰는 게 좋습니다.
            // 여기서는 일단 전체에서 필터링하는 방식으로 안전하게 작성합니다.
            reservations.stream()
                    .filter(r -> r.getUser().getUserId().equals(userId))
                    .forEach(r -> {
                        Booth booth = r.getBooth();
                        long current = booth.getCurrentPerson() == null ? 0L : booth.getCurrentPerson();
                        long count = r.getCount();
                        
                        // 인원 차감
                        long newCount = (current >= count) ? (current - count) : 0L;
                        booth.setCurrentPerson(newCount);
                        booth.setStatus(true); // 자리 났으니 예약 가능으로 변경
                        boothRepository.save(booth);
                    });

            // 연관 데이터 삭제
            userSessionRepository.deleteByUserId(userId);
            reservationRepository.deleteByUser_UserId(userId);
            postRepository.deleteByUser_UserId(userId);

        } catch (Exception e) {
            throw new RuntimeException("회원 연관 데이터 삭제 중 오류 발생: " + e.getMessage());
        }

        // 최종 삭제
        userRepository.delete(user);
    }
}