package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.backend.entity.Popup; // 대문자 Popup 확인

import java.time.LocalDateTime;
import java.util.List;

public interface PopUpRepository extends JpaRepository<Popup, Long> {

    // [수정] Admin 목록 조회용 (우선순위 -> ID 정렬)
    List<Popup> findAllByOrderByPriorityAscPopupIdAsc();

    // 현재 활성화된 팝업 조회
    @Query("SELECT DISTINCT p FROM Popup p " +
           "JOIN p.schedules s " +
           "WHERE p.status = true " +
           "AND :now BETWEEN s.startAt AND s.endAt " +
           "ORDER BY p.priority DESC")
    List<Popup> findActivePopups(@Param("now") LocalDateTime now);
}