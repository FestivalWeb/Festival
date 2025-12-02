package org.zerock.backend.admin.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.zerock.backend.admin.dto.AdminLoginRequest;
import org.zerock.backend.admin.dto.AdminLoginResponse;
import org.zerock.backend.admin.dto.AdminSignupRequest;
import org.zerock.backend.admin.dto.AdminSignupResponse;
import org.zerock.backend.admin.dto.PendingAdminResponse;
import org.zerock.backend.admin.service.AdminAuthService;
import org.zerock.backend.entity.AdminRole;
import org.zerock.backend.entity.AdminUser;
import org.zerock.backend.repository.AdminRoleRepository;
import org.zerock.backend.repository.AdminUserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {
    // Admin 인증 관련 로직을 처리하는 서비스
    private final AdminAuthService adminAuthService;
    private final AdminRoleRepository adminRoleRepository;
    private final AdminUserRepository adminUserRepository;
    
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

    // ✅ SUPER 권한 체크 헬퍼
    private boolean isSuper(Long adminId) {
        if (adminId == null) return false;
        return adminRoleRepository
                .existsByAdminUser_AdminIdAndRole_RoleCode(adminId, "SUPER");
    }

    @GetMapping("/pending")
    public ResponseEntity<List<PendingAdminResponse>> getPendingAdmins(HttpServletRequest request) {

        Long loginAdminId = (Long) request.getAttribute("loginAdminId");
        if (loginAdminId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        if (!isSuper(loginAdminId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "SUPER 권한이 없습니다.");
        }

        List<PendingAdminResponse> list = adminAuthService.getPendingAdmins();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/approve/{adminId}")
    public ResponseEntity<Void> approveAdmin(
            @PathVariable Long adminId,
            HttpServletRequest request
    ) {
        Long loginAdminId = (Long) request.getAttribute("loginAdminId");
        if (loginAdminId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        if (!isSuper(loginAdminId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "SUPER 권한이 없습니다.");
        }

        // 승인자 엔티티는 여기서 한 번만 조회해서 서비스에 넘김
        AdminUser approver = adminUserRepository.findById(loginAdminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "승인자 정보를 찾을 수 없습니다."));

        adminAuthService.approveAdmin(adminId, approver);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reject/{adminId}")
    public ResponseEntity<Void> rejectAdmin(
            @PathVariable Long adminId,
            HttpServletRequest request
    ) {
        Long loginAdminId = (Long) request.getAttribute("loginAdminId");
        if (loginAdminId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        if (!isSuper(loginAdminId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "SUPER 권한이 없습니다.");
        }

        AdminUser approver = adminUserRepository.findById(loginAdminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "승인자 정보를 찾을 수 없습니다."));

        adminAuthService.rejectAdmin(adminId, approver);
        return ResponseEntity.noContent().build();
    }

}
