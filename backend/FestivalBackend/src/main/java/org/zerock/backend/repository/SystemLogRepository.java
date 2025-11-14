package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.SystemLogEntity;
import org.zerock.backend.entity.LogLevel;

import java.time.LocalDateTime;
import java.util.List;

public interface SystemLogRepository extends JpaRepository<SystemLogEntity, Long> {

    // 로그 레벨 기준 조회
    List<SystemLogEntity> findByLevel(LogLevel level);

    // 특정 시간 이후 발생한 로그 조회
    List<SystemLogEntity> findByOccurredAtAfter(LocalDateTime time);

    // 특정 시간 범위
    List<SystemLogEntity> findByOccurredAtBetween(LocalDateTime start, LocalDateTime end);

    // 특정 IP
    List<SystemLogEntity> findByIpAddress(String ipAddress);

    // 특정 경로
    List<SystemLogEntity> findByPath(String path);

    // 상태코드 기반 조회
    List<SystemLogEntity> findByStatusCode(Long statusCode);
}
