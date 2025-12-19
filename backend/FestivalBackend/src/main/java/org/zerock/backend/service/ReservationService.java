package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.dto.ReservationDto;
import org.zerock.backend.entity.Booth;
import org.zerock.backend.entity.Reservation;
import org.zerock.backend.entity.UserEntity;
import org.zerock.backend.repository.BoothRepository;
import org.zerock.backend.repository.ReservationRepository;
import org.zerock.backend.repository.UserRepository;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null") // Null 관련 경고 무시 설정
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BoothRepository boothRepository;
    private final UserRepository userRepository;

    // 예약하기
    public Long makeReservation(ReservationDto.Request request) {
        
        // ▼▼▼ [범인 색출 코드] 로그를 찍어서 확인해봅시다 ▼▼▼
        System.out.println("================ 예약 요청 디버깅 ================");
        System.out.println("받은 UserId: " + request.getUserId());
        System.out.println("받은 BoothId: " + request.getBoothId());
        System.out.println("================================================");

        // 1. 여기서 null 체크를 먼저 해서, 에러 메시지를 명확하게 바꿉니다.
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("오류 발생: 유저 ID(userId)가 넘어오지 않았습니다. 프론트엔드 전송 데이터 확인 필요!");
        }
        if (request.getBoothId() == null) {
            throw new IllegalArgumentException("오류 발생: 부스 ID(boothId)가 넘어오지 않았습니다. 버튼 클릭 시 ID가 잘 들어갔는지 확인 필요!");
        }

        // 2. 유저 조회 (이제 여기서 에러 안 남)
        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다. (ID: " + request.getUserId() + ")"));

        // 3. 부스 조회
        Booth booth = boothRepository.findById(request.getBoothId())
                .orElseThrow(() -> new IllegalArgumentException("부스 정보를 찾을 수 없습니다. (ID: " + request.getBoothId() + ")"));

        // ... (나머지 로직은 그대로) ...
        
        long current = booth.getCurrentPerson() == null ? 0L : booth.getCurrentPerson();

        if (request.getCount() < 1) {
            throw new IllegalArgumentException("예약 인원은 최소 1명 이상이어야 합니다.");
        }
        
        if (current + request.getCount() > booth.getMaxPerson()) {
            throw new IllegalStateException("예약 정원이 초과되었습니다.");
        }

        booth.setCurrentPerson(current + request.getCount());
        
        if (booth.getCurrentPerson().equals(booth.getMaxPerson())) {
            booth.setStatus(false);
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .booth(booth)
                .reserDate(LocalDate.parse(request.getReserveDate()))
                .count(request.getCount())
                .build();

        return reservationRepository.save(reservation).getId();
    }

    // [수정] 내 예약 목록 조회 (페이징 적용)
    @Transactional(readOnly = true)
    public Page<ReservationDto.Response> getMyReservations(String userId, Pageable pageable) {
        return reservationRepository.findByUser_UserIdOrderByReserDateDesc(userId, pageable)
                .map(r -> ReservationDto.Response.builder()
                        .reservationId(r.getId())
                        .boothTitle(r.getBooth().getTitle())
                        .boothLocation(r.getBooth().getLocation())
                        .reserveDate(r.getReserDate())
                        .count(r.getCount())
                        .status("예약확정")
                        // [추가] 부스 이미지 연결
                        .boothImg(r.getBooth().getImg()) 
                        .build());
    }
    
    // 예약 취소 기능
    public void cancelReservation(Long reservationId) {
        Reservation r = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보가 없습니다."));
        
        // 부스 인원 원상복구
        Booth booth = r.getBooth();
        long current = booth.getCurrentPerson() == null ? 0L : booth.getCurrentPerson();
        long newCount = current - r.getCount();
        
        booth.setCurrentPerson(newCount < 0 ? 0 : newCount);
        booth.setStatus(true); // 자리 생겼으니 다시 오픈

        reservationRepository.delete(r);
    }
}