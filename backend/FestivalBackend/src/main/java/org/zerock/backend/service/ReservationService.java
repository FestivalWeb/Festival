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
        // 1. 유저 조회
        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        // 2. 부스 조회
        Booth booth = boothRepository.findById(request.getBoothId())
                .orElseThrow(() -> new IllegalArgumentException("부스 정보를 찾을 수 없습니다."));

        // 3. 인원 체크 (현재인원 + 예약인원 > 최대인원 이면 에러)
        // NullPointerException 방지를 위해 기본값 0 처리
        long current = booth.getCurrentPerson() == null ? 0L : booth.getCurrentPerson();
        
        if (current + request.getCount() > booth.getMaxPerson()) {
            throw new IllegalStateException("예약 정원이 초과되었습니다.");
        }

        // 4. 부스 현재 인원 증가 시키기
        booth.setCurrentPerson(current + request.getCount());
        
        // 만약 꽉 찼으면 status를 false(마감)로 바꿀 수도 있음
        if (booth.getCurrentPerson().equals(booth.getMaxPerson())) {
            booth.setStatus(false);
        }

        // 5. 예약 정보 저장
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