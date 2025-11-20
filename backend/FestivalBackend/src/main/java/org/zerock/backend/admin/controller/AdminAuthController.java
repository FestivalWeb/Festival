package org.zerock.backend.admin.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.admin.dto.AdminLoginRequest;
import org.zerock.backend.admin.dto.AdminLoginResponse;
import org.zerock.backend.admin.service.AdminAuthService;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(
            @RequestBody AdminLoginRequest request,
            HttpServletRequest httpRequest
    ) {
        AdminLoginResponse response = adminAuthService.login(request, httpRequest);
        return ResponseEntity.ok(response);
    }
}
