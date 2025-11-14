package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // 특정 날짜의 예약 조회
    // List<Reservation> findByReserDate(LocalDate date);
}