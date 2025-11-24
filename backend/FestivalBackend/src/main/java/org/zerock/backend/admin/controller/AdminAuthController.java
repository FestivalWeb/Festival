package org.zerock.backend.admin.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.admin.dto.AdminLoginRequest;
import org.zerock.backend.admin.dto.AdminLoginResponse;
import org.zerock.backend.admin.dto.AdminSignupRequest;
import org.zerock.backend.admin.dto.AdminSignupResponse;
import org.zerock.backend.admin.service.AdminAuthService;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {
    // Admin 인증 관련 로직을 처리하는 서비스
    private final AdminAuthService adminAuthService;

    /**
     * 관리자 로그인 API
     * ----------------------------------------------------------
     * [POST] /api/admin/auth/login
     *
     * 클라이언트가 전송한 로그인 정보(AdminLoginRequest)를 기반으로
     * AdminAuthService에서 로그인 검증 및 세션 발급을 수행한다.
     *
     * @param request     로그인 요청 DTO (id, password 등)
     * @param httpRequest 클라이언트의 request 객체 (IP 조회 등에서 사용)
     * @return 로그인 성공 시 AdminLoginResponse (세션 토큰, 관리자 정보 등)
     */

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(
            @RequestBody AdminLoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        // 서비스 계층에서 로그인 로직 처리
        AdminLoginResponse response = adminAuthService.login(request, httpRequest, httpResponse);

        // 200 OK + 로그인 결과 반환
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request,
                                       HttpServletResponse response) {

        System.out.println("### CONTROLLER: /api/admin/auth/logout called");
        adminAuthService.logout(request, response);
        // 프론트는 204 No Content 만 보고 "로그아웃 성공" 처리하면 됨
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/signup")
    public ResponseEntity<AdminSignupResponse> signup(
            @RequestBody AdminSignupRequest request,
            HttpServletRequest httpRequest
    ) {
        AdminSignupResponse response = adminAuthService.signup(request, httpRequest);
        // 201 Created로 보내도 되고, 일단 200 OK로 둬도 무방
        return ResponseEntity.ok(response);
    }
}
