package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.AdminActivityLog;

import java.time.LocalDateTime;
import java.util.List;

public interface AdminActivityLogRepository extends JpaRepository<AdminActivityLog, Long> {
    
    // [수정] adminUser를 함께 로딩하여 Lazy 에러 방지
    @EntityGraph(attributePaths = {"adminUser"})
    List<AdminActivityLog> findTop100ByOrderByOccurredAtDesc();

    // [추가] 날짜 범위 검색 메서드 (검색 결과 없음 해결)
    @EntityGraph(attributePaths = {"adminUser"})
    List<AdminActivityLog> findByOccurredAtBetweenOrderByOccurredAtDesc(LocalDateTime start, LocalDateTime end);
}