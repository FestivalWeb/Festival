package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.backend.entity.Popup;

import java.time.LocalDateTime;
import java.util.List;

public interface PopUpRepository extends JpaRepository<Popup, Long> {

    // 1) 현재 활성화된 팝업 조회 (스케줄 날짜 기준)
    // 우선순위(priority)가 높은 순서대로 정렬 (숫자가 클수록 높은지 작을수록 높은지는 정책에 따라 DESC/ASC 조정)
    @Query("SELECT DISTINCT p FROM Popup p " +
           "JOIN p.schedules s " +
           "WHERE p.status = true " +
           "AND :now BETWEEN s.startAt AND s.endAt " +
           "ORDER BY p.priority DESC")
    List<Popup> findActivePopups(@Param("now") LocalDateTime now);
}