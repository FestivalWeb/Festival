package org.zerock.backend.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.admin.dto.AdminRoleUpdateRequest;
import org.zerock.backend.admin.dto.AdminStatusUpdateRequest;
import org.zerock.backend.admin.dto.AdminUserSummaryResponse;
import org.zerock.backend.admin.service.AdminAccountService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
public class AdminAccountController {

    private final AdminAccountService adminAccountService;

    /**
     * 관리자 계정 목록 조회
     * [GET] /api/admin/accounts
     */
    @GetMapping
    public ResponseEntity<List<AdminUserSummaryResponse>> getAdminAccounts() {
        List<AdminUserSummaryResponse> list = adminAccountService.getAdminUserList();
        return ResponseEntity.ok(list);
    }

    /**
     * 관리자 권한 변경 (SUPER만 사용 가능)
     * PATCH /api/admin/accounts/{adminId}/role
     */
    @PatchMapping("/{adminId}/role")
    public ResponseEntity<Void> changeAdminRole(
            @PathVariable Long adminId,
            @RequestBody AdminRoleUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        adminAccountService.changeAdminRole(adminId, request.getRoleCode(), httpRequest);
        return ResponseEntity.noContent().build();
    }

    /**
     * 관리자 활성/비활성 상태 변경
     * PATCH /api/admin/accounts/{adminId}/status
     */
    @PatchMapping("/{adminId}/status")
    public ResponseEntity<Void> changeAdminStatus(
            @PathVariable Long adminId,
            @RequestBody AdminStatusUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        adminAccountService.changeAdminActiveStatus(adminId, request.isActive(), httpRequest);
        return ResponseEntity.noContent().build();
    }

    /**
     * 관리자 계정 삭제 (SUPER만 가능)
     * DELETE /api/admin/accounts/{adminId}
     */
    @DeleteMapping("/{adminId}")
    public ResponseEntity<Void> deleteAdmin(
            @PathVariable Long adminId,
            HttpServletRequest request
    ) {
        adminAccountService.deleteAdmin(adminId, request);
        return ResponseEntity.noContent().build();
    }
}
