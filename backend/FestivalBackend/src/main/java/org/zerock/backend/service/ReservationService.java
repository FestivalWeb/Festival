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
@SuppressWarnings("null") 
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BoothRepository boothRepository;
    private final UserRepository userRepository;

    // 예약하기
    public Long makeReservation(ReservationDto.Request request) {
        
        // 1. 기본 유효성 검사
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("오류 발생: 유저 ID(userId)가 넘어오지 않았습니다.");
        }
        if (request.getBoothId() == null) {
            throw new IllegalArgumentException("오류 발생: 부스 ID(boothId)가 넘어오지 않았습니다.");
        }

        // [추가] 중복 예약 확인 로직
        boolean isDuplicate = reservationRepository.existsByUser_UserIdAndBooth_Id(request.getUserId(), request.getBoothId());
        if (isDuplicate) {
            throw new IllegalStateException("이미 예약한 부스입니다. 마이페이지 예약 내역을 확인해주세요.");
        }

        // 2. 유저 조회
        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다. (ID: " + request.getUserId() + ")"));

        // 3. 부스 조회
        Booth booth = boothRepository.findById(request.getBoothId())
                .orElseThrow(() -> new IllegalArgumentException("부스 정보를 찾을 수 없습니다. (ID: " + request.getBoothId() + ")"));

        
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

    // 내 예약 목록 조회 (페이징 적용)
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