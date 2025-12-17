package org.zerock.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // [수정] List -> Page로 변경, Pageable 파라미터 추가
    Page<Reservation> findByUser_UserIdOrderByReserDateDesc(String userId, Pageable pageable);

    void deleteByUser_UserId(String userId);
}