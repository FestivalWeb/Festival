package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.SystemLogEntity;
import java.time.LocalDateTime;
import java.util.List;

public interface SystemLogRepository extends JpaRepository<SystemLogEntity, Long> {
    // [추가] 날짜 기간으로 내림차순 조회
    List<SystemLogEntity> findByOccurredAtBetweenOrderByOccurredAtDesc(LocalDateTime start, LocalDateTime end);
    
    // [추가] 최근 100개 조회
    List<SystemLogEntity> findTop100ByOrderByOccurredAtDesc();
}