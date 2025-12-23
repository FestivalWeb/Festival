package org.zerock.backend.admin.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.zerock.backend.entity.*;
import org.zerock.backend.repository.AdminActivityLogRepository;
import org.zerock.backend.repository.AdminLoginAuditRepository;
import org.zerock.backend.repository.SystemLogRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminLogWriter {

    private final AdminActivityLogRepository activityLogRepository;
    private final AdminLoginAuditRepository loginAuditRepository;
    private final SystemLogRepository systemLogRepository;

    // ---- 공통: IP 꺼내는 헬퍼 ----
    private String resolveClientIp(HttpServletRequest request) {
        if (request == null) return null;

        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && !ip.isBlank()) {
            return ip.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    // ============================================================
    // 1. 관리자 활동 로그 (게시판/팝업/회원 등)
    // ============================================================

    public void logActivity(
            AdminUser adminUser,
            String actionType,   // 예: "CREATE", "UPDATE", "DELETE", "LOGIN"
            String message,      // 예: "이벤트 게시물 삭제", "팝업 생성"
            String path,         // 예: "/admin/boards/evt/5"
            String targetType,   // 예: "BOARD", "POPUP"
            Long targetId,
            HttpServletRequest request
    ) {
        AdminActivityLog log = new AdminActivityLog();
        log.setAdminUser(adminUser);
        log.setActionType(actionType);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setMessage(message);
        log.setPath(path);
        log.setIpAddress(resolveClientIp(request));
        log.setOccurredAt(LocalDateTime.now());

        activityLogRepository.save(log);
    }

    // ============================================================
    // 2. 로그인 감사 로그
    // ============================================================

    public void logLoginSuccess(String username, HttpServletRequest request) {
        AdminLoginAudit log = new AdminLoginAudit();
        log.setUsername(username);
        log.setSuccess(true);
        log.setReason(null);
        log.setIpAddress(resolveClientIp(request));
        log.setUserAgent(request != null ? request.getHeader("User-Agent") : null);
        // occurredAt은 @PrePersist 에서 세팅
        loginAuditRepository.save(log);
    }

    public void logLoginFailure(String username, String reason, HttpServletRequest request) {
        AdminLoginAudit log = new AdminLoginAudit();
        log.setUsername(username);
        log.setSuccess(false);
        log.setReason(reason);
        log.setIpAddress(resolveClientIp(request));
        log.setUserAgent(request != null ? request.getHeader("User-Agent") : null);
        loginAuditRepository.save(log);
    }

    // ============================================================
    // 3. 시스템 로그 (ERROR, WARN, INFO)
    // ============================================================

    public void logSystem(
            LogLevel level,
            String message,
            String path,
            HttpServletRequest request,
            Long statusCode,
            String referrer
    ) {
        SystemLogEntity log = new SystemLogEntity();
        log.setLevel(level);
        log.setMessage(message);
        log.setPath(path);
        log.setIpAddress(resolveClientIp(request));
        log.setUserAgent(request != null ? request.getHeader("User-Agent") : null);
        log.setReferrer(referrer);
        log.setStatusCode(statusCode);
        log.setOccurredAt(LocalDateTime.now());

        systemLogRepository.save(log);
    }
}
