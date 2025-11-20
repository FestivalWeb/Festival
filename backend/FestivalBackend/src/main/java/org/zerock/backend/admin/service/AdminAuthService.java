package org.zerock.backend.admin.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.zerock.backend.admin.dto.AdminLoginRequest;
import org.zerock.backend.admin.dto.AdminLoginResponse;
import org.zerock.backend.entity.AdminSession;
import org.zerock.backend.entity.AdminUser;
import org.zerock.backend.repository.AdminIpWhitelistRepository;
import org.zerock.backend.repository.AdminSessionRepository;
import org.zerock.backend.repository.AdminUserRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminUserRepository adminUserRepository;
    private final AdminIpWhitelistRepository adminIpWhitelistRepository;
    private final AdminSessionRepository adminSessionRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminLoginResponse login(AdminLoginRequest request, HttpServletRequest httpRequest) {

        // 1. 계정 조회
        AdminUser adminUser = adminUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다."));

        // 2. 계정 활성 상태 확인
        if (!adminUser.isActive()) {
            throw new IllegalStateException("비활성화된 관리자 계정입니다.");
        }

        // 3. 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), adminUser.getPasswordHash())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        // 4. 클라이언트 IP 가져오기
        String clientIp = extractClientIp(httpRequest);

        System.out.println("### ADMIN LOGIN clientIp = [" + clientIp + "]");

        // 5. IP 화이트리스트 체크
        boolean allowed = adminIpWhitelistRepository
                .existsByAdminUserAndIpAddress(adminUser, clientIp);

        if (!allowed) {
            throw new IllegalStateException("허용되지 않은 IP 주소입니다.");
        }

        // 6. 세션 생성
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusHours(2); // 세션 유효시간: 2시간 (원하면 바꿔도 됨)

        String sessionId = UUID.randomUUID().toString();

        AdminSession session = new AdminSession();
        session.setSessionId(sessionId);
        session.setAdminUser(adminUser);
        session.setIpAddress(clientIp);
        session.setUserAgent(httpRequest.getHeader("User-Agent"));
        session.setExpiresAt(expiresAt);
        session.setRevoked(false);

        adminSessionRepository.save(session);

        // 7. 응답 DTO 생성
        return AdminLoginResponse.builder()
                .sessionId(sessionId)
                .expiresAt(expiresAt)
                .username(adminUser.getUsername())
                .adminName(adminUser.getName())
                .ipAddress(clientIp)
                .build();
    }

    // X-Forwarded-For 고려해서 IP 추출
    private String extractClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        String ip;

        if (forwarded != null && !forwarded.isBlank()) {
            ip = forwarded.split(",")[0].trim();
        } else {
            ip = request.getRemoteAddr();
        }

        // 🔹 로컬 개발환경용: IPv6 localhost → IPv4로 변환
        if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) {
            ip = "127.0.0.1";
        }

        System.out.println("### ADMIN LOGIN clientIp(normalized) = [" + ip + "]");
        return ip;
    }

    
}
