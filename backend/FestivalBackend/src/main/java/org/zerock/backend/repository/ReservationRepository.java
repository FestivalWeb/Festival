package org.zerock.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    Page<Reservation> findByUser_UserIdOrderByReserDateDesc(String userId, Pageable pageable);

    void deleteByUser_UserId(String userId);

    // [추가] 특정 유저가 특정 부스를 예약했는지 확인 (중복 예약 방지용)
    boolean existsByUser_UserIdAndBooth_Id(String userId, Long boothId);
}