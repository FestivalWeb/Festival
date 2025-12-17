package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.backend.entity.Popup; // Entity 이름 대소문자 주의 (Popup)

import java.time.LocalDateTime;
import java.util.List;

public interface PopUpRepository extends JpaRepository<Popup, Long> {

    /**
     * 현재 시간(now)이 스케줄의 시작(startAt)과 종료(endAt) 사이에 있는 팝업 조회
     * - 우선순위(priority) 높은 순으로 정렬
     */
    @Query("SELECT DISTINCT p FROM Popup p " +
           "JOIN p.schedules s " +
           "WHERE s.startAt <= :now AND s.endAt >= :now " +
           "ORDER BY p.priority DESC, p.popupId DESC")
    List<Popup> findActivePopups(@Param("now") LocalDateTime now);

}