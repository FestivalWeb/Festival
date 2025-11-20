package org.zerock.backend.admin.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseCookie;
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

import java.util.Optional;
import jakarta.servlet.http.Cookie;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminUserRepository adminUserRepository;
    private final AdminIpWhitelistRepository adminIpWhitelistRepository;
    private final AdminSessionRepository adminSessionRepository;
    private final PasswordEncoder passwordEncoder;

    // 세션 유지 시간 (슬라이딩 기준)
    private static final long SESSION_HOURS = 2L;


    /**
     * 관리자 로그인 처리
     *
     * - 아이디/비밀번호 검증
     * - IP 화이트리스트 검사
     * - 기존 세션 있으면 재사용 (쿠키에 있는 sessionId 기준)
     * - 없으면 새 AdminSession 생성
     * - 세션 ID를 쿠키와 응답 DTO로 내려줌
     */

    public AdminLoginResponse login(AdminLoginRequest request, HttpServletRequest httpRequest,  HttpServletResponse httpResponse) {

        // 1. 계정 조회 (아이디 기준으로 관리자 조회)
        AdminUser adminUser = adminUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다."));

        // 2. 계정 활성 상태 확인 (비활성 계정 로그인 방지)
        if (!adminUser.isActive()) {
            throw new IllegalStateException("비활성화된 관리자 계정입니다.");
        }

        // 3. 비밀번호 검증 (입력한 비번과 DB에 저장된 해시)
        if (!passwordEncoder.matches(request.getPassword(), adminUser.getPasswordHash())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        // 4. 클라이언트 IP 가져오기
        String clientIp = extractClientIp(httpRequest);

        System.out.println("### ADMIN LOGIN clientIp = [" + clientIp + "]");

        // 5. IP 화이트리스트 체크 (해당 관리자 계정에 허용된 IP인지 확인)
        boolean allowed = adminIpWhitelistRepository
                .existsByAdminUserAndIpAddress(adminUser, clientIp);

        if (!allowed) {
            throw new IllegalStateException("허용되지 않은 IP 주소입니다.");
        }

        LocalDateTime now = LocalDateTime.now();

         // 6. 요청 쿠키에서 기존 세션 가져오기 - 브라우저에 이미 ADMIN_SESSION_ID 쿠키가 있으면 세션 재사용 시도
        String existingSessionId = extractSessionIdFromCookie(httpRequest);

        if (existingSessionId != null) {
            // 6-1. DB에서 유효한 세션인지 확인
            //      조건: sessionId 일치 + isRevoked = false + expiresAt > now
            Optional<AdminSession> opt = adminSessionRepository.findValidSession(existingSessionId, now)
                .filter(s -> s.getAdminUser().equals(adminUser));   // 다른 관리자 계정의 세션이면 안 되므로 adminUser도 일치하는지 한 번 더 체크

        if (opt.isPresent()) {
            // 유효한 세션이 존재 → 이 세션 "재사용"
            AdminSession session = opt.get();

            // 마지막 접근 시간, 만료 시간 갱신 
            session.setLastAccessAt(now);
            session.setExpiresAt(now.plusHours(SESSION_HOURS));
            adminSessionRepository.save(session);

            // 쿠키도 다시 내려서 브라우저 쪽 만료시간 연장
            setSessionCookie(httpResponse, existingSessionId);

            // 기존 세션 정보를 그대로 응답
            return AdminLoginResponse.builder()
                    .sessionId(existingSessionId)
                    .expiresAt(session.getExpiresAt())
                    .username(adminUser.getUsername())
                    .adminName(adminUser.getName())
                    .ipAddress(clientIp)
                    .build();
            }
        }

        // 7. 세션 생성 (기존 세션 없음)
        String sessionId = UUID.randomUUID().toString();
        LocalDateTime expiresAt = now.plusHours(SESSION_HOURS);

        AdminSession session = new AdminSession();
        session.setSessionId(sessionId);
        session.setAdminUser(adminUser);
        session.setIpAddress(clientIp);
        session.setUserAgent(httpRequest.getHeader("User-Agent"));
        session.setLastAccessAt(now);
        session.setExpiresAt(expiresAt);
        session.setRevoked(false); 

        // DB에 세션 저장
        adminSessionRepository.save(session);

        // 8. 새 세션 ID를 쿠키로 브라우저에 심기
        setSessionCookie(httpResponse, sessionId);

        // 9. 응답 DTO 생성 (프론트에서 세션 정보 참고용)
        return AdminLoginResponse.builder()
                .sessionId(sessionId)
                .expiresAt(expiresAt)
                .username(adminUser.getUsername())
                .adminName(adminUser.getName())
                .ipAddress(clientIp)
                .build();
    }

    /**
     * 요청에 실려온 쿠키들에서 ADMIN_SESSION_ID 값을 꺼낸다.
     * - 없다면 null 반환
     */
    private String extractSessionIdFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if ("ADMIN_SESSION_ID".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    /**
     * ADMIN_SESSION_ID 쿠키를 설정한다.
     * - HttpOnly: JS에서 접근 못하게 (XSS 방어)
     * - path: "/" → 전체 경로에서 사용 (또는 "/admin"으로 제한해도 됨)
     * - maxAge: 세션 유지 시간(초 단위)
     * - sameSite: Lax → CSRF 공격 줄이는 용도
     */
    private void setSessionCookie(HttpServletResponse response, String sessionId) {
        ResponseCookie cookie = ResponseCookie.from("ADMIN_SESSION_ID", sessionId)
                .httpOnly(true)
                .path("/")        // /admin 으로 한정해도 됨
                .maxAge(SESSION_HOURS * 60 * 60)
                .sameSite("Lax")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
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
