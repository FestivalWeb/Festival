package org.zerock.backend.admin.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zerock.backend.entity.AdminSession;
import org.zerock.backend.repository.AdminSessionRepository;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import org.springframework.lang.NonNull;

@Component
@RequiredArgsConstructor
public class AdminSessionFilter extends OncePerRequestFilter {

    private final AdminSessionRepository adminSessionRepository;

    // 로그인 서비스와 맞춰 주기 (2시간)
    private static final long SESSION_HOURS = 2L;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 쿠키에서 ADMIN_SESSION_ID 꺼내기
        String sessionId = extractSessionIdFromCookie(request);

        if (sessionId != null) {
            LocalDateTime now = LocalDateTime.now();

            // 2. DB에서 세션 조회 (유효/만료/취소 여부 다 보고 싶으니 findById 사용)
            Optional<AdminSession> opt = adminSessionRepository.findById(sessionId);

            if (opt.isPresent()) {
                AdminSession session = opt.get();

                // 2-1. 취소됐거나, 만료 시간이 지났으면 → 세션 삭제 + 쿠키 제거
                if (session.isRevoked() || session.getExpiresAt().isBefore(now)) {

                    adminSessionRepository.delete(session);  // DB에서 삭제

                    clearSessionCookie(response);            // 브라우저 쿠키 제거
                } else {
                    // 2-2. 아직 유효한 세션이면 → 슬라이딩 만료 적용

                    // 마지막 접근 시각 갱신
                    session.setLastAccessAt(now);
                    // 만료 시간도 "지금 기준 + 2시간"으로 연장
                    session.setExpiresAt(now.plusHours(SESSION_HOURS));
                    adminSessionRepository.save(session);

                    // 쿠키도 다시 내려서 브라우저 쪽 만료 시간 연장
                    refreshSessionCookie(response, sessionId);
                    
                    // 🔥 여기서 엔티티 전체가 아니라 adminId만 심는다
                    request.setAttribute("loginAdminId", session.getAdminUser().getAdminId());

                    // (선택) 필요하다면 요청에 현재 관리자 정보 심어줄 수도 있음
                    // request.setAttribute("adminUser", session.getAdminUser());
                }
            } else {
                // DB에 없는 sessionId면, 쿠키만 떠돌고 있는 상태 → 쿠키 정리
                clearSessionCookie(response);
            }
        }

        // 3. 다음 필터 또는 컨트롤러로 요청 넘김
        filterChain.doFilter(request, response);
    }

    /**
     * 이 필터를 적용하지 않을 URL을 정의
     * - 여기서는 /api/admin/** 만 필터 타게 해서, 다른 일반 API에는 영향 주지 않음.
     */
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String uri = request.getRequestURI();

        // /api/admin/ 로 시작하는 요청만 세션 체크
        return !uri.startsWith("/api/admin/");
    }

    // ─────────────────────────────────────────────
    // 아래는 편의 메서드들
    // ─────────────────────────────────────────────

    // 요청 쿠키에서 ADMIN_SESSION_ID 값 추출
    private String extractSessionIdFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;

        return Arrays.stream(cookies)
                .filter(c -> "ADMIN_SESSION_ID".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    // 세션 쿠키 갱신 (만료 시간 연장)
    private void refreshSessionCookie(HttpServletResponse response, String sessionId) {
        ResponseCookie cookie = ResponseCookie.from("ADMIN_SESSION_ID", sessionId)
                .httpOnly(true)
                .path("/")
                .maxAge(SESSION_HOURS * 60 * 60) // 2시간
                .sameSite("Lax")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    // 세션 쿠키 삭제 (로그아웃/만료된 세션 정리용)
    private void clearSessionCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("ADMIN_SESSION_ID", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0) // 0초 → 즉시 만료
                .sameSite("Lax")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }
}
