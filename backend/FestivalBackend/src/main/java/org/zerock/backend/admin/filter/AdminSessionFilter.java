package org.zerock.backend.admin.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // 로그 출력을 위해 추가
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zerock.backend.entity.AdminSession;
import org.zerock.backend.entity.AdminUser;
import org.zerock.backend.repository.AdminSessionRepository;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import org.springframework.lang.NonNull;

@Slf4j // 롬복 로그 추가
@Component
@RequiredArgsConstructor
public class AdminSessionFilter extends OncePerRequestFilter {

    private final AdminSessionRepository adminSessionRepository;

    // 로그인 유지 시간 (2시간)
    private static final long SESSION_HOURS = 2L;
    
    // [핵심] DB 업데이트 최소 간격 (예: 60초)
    // 60초가 안 지났으면 굳이 DB에 update 쿼리를 날리지 않음 -> 동시성 충돌 방지
    private static final long UPDATE_INTERVAL_SECONDS = 60L;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String sessionId = extractSessionIdFromCookie(request);

        if (sessionId != null) {
            LocalDateTime now = LocalDateTime.now();

            try {
                // DB 조회
                Optional<AdminSession> opt = adminSessionRepository.findById(sessionId);

                if (opt.isPresent()) {
                    AdminSession session = opt.get();

                    // 1. 만료/취소 체크
                    if (session.isRevoked() || session.getExpiresAt().isBefore(now)) {
                        adminSessionRepository.delete(session);
                        clearSessionCookie(response);
                    } else {
                        // 2. 유효한 세션
                        
                        // [핵심 로직 변경] 매번 DB를 업데이트하지 않고, 일정 시간이 지났을 때만 업데이트
                        long secondsSinceLastAccess = Duration.between(session.getLastAccessAt(), now).getSeconds();
                        
                        if (secondsSinceLastAccess > UPDATE_INTERVAL_SECONDS) {
                            try {
                                session.setLastAccessAt(now);
                                session.setExpiresAt(now.plusHours(SESSION_HOURS));
                                adminSessionRepository.save(session);
                            } catch (Exception e) {
                                // [중요] 동시 요청(대시보드 로딩 등)으로 인해 다른 스레드가 먼저 업데이트했을 경우
                                // "Record has changed" 에러가 날 수 있음.
                                // 이 경우, 이미 누군가 갱신했다는 뜻이므로 쿨하게 무시하고 진행한다.
                                log.warn("세션 갱신 중 동시성 충돌 발생 (무시함): {}", e.getMessage());
                            }
                        }

                        // 쿠키는 브라우저 만료 시간 연장을 위해 매번 갱신해도 됨 (DB 부하 없음)
                        refreshSessionCookie(response, sessionId);

                        AdminUser loginAdmin = session.getAdminUser();
                        request.setAttribute("loginAdminId", loginAdmin.getAdminId());
                    }
                } else {
                    clearSessionCookie(response);
                }
            } catch (Exception e) {
                log.error("세션 필터 처리 중 에러 발생", e);
                // 치명적인 에러가 아니면 통과시킬지, 401을 줄지 결정.
                // 보통 세션 DB 에러면 로그인을 유지하기 어려우므로 쿠키 지우는 게 안전할 수도 있음.
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String uri = request.getRequestURI();
        return !uri.startsWith("/api/admin/");
    }

    // --- 편의 메서드들 ---

    private String extractSessionIdFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;

        return Arrays.stream(cookies)
                .filter(c -> "ADMIN_SESSION_ID".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private void refreshSessionCookie(HttpServletResponse response, String sessionId) {
        ResponseCookie cookie = ResponseCookie.from("ADMIN_SESSION_ID", sessionId)
                .httpOnly(true)
                .path("/")
                .maxAge(SESSION_HOURS * 60 * 60)
                .sameSite("Lax")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    private void clearSessionCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("ADMIN_SESSION_ID", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }
}