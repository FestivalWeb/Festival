package org.zerock.backend.repository;

import org.zerock.backend.entity.AdminSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface AdminSessionRepository extends JpaRepository<AdminSession, String> {
    // 세션 토큰으로 유효한 세션을 찾을 때 (만료 X + 취소 X)
    @Query("""
        SELECT s FROM AdminSession s
        WHERE s.sessionId = :sessionId
          AND s.isRevoked = false
          AND s.expiresAt > :now
        """)
    Optional<AdminSession> findValidSession(String sessionId, LocalDateTime now);

    // 만료된 세션 일괄 삭제용
    void deleteByExpiresAtBefore(LocalDateTime now);
}