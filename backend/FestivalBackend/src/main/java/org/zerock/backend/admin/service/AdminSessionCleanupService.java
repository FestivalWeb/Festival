package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.zerock.backend.repository.AdminSessionRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminSessionCleanupService {

    private final AdminSessionRepository adminSessionRepository;

    /**
     * 만료된 세션 정리 작업
     *
     * cron = "0 0 * * * *"
     *  → 매 시간 0분(정각)에 한 번 실행
     */
    @Scheduled(cron = "0 0 * * * *")
    public void cleanupExpiredSessions() {
        LocalDateTime now = LocalDateTime.now();
        int beforeCount = (int) adminSessionRepository.count();

        adminSessionRepository.deleteByExpiresAtBefore(now);

        int afterCount = (int) adminSessionRepository.count();
        System.out.println("### AdminSessionCleanupService: " +
                (beforeCount - afterCount) + "개 세션 삭제됨");
    }
}
