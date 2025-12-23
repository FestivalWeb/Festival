package org.zerock.backend.admin.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import org.zerock.backend.entity.AdminApproveStatus;

@Getter
@Setter
@Builder
public class AdminLoginResponse {

    private String sessionId;        // 발급된 세션 토큰 (AdminSession.sessionId)
    private LocalDateTime expiresAt; // 만료 시간
    private String username;         // 로그인 ID
    private String adminName;        // 관리자 이름 (표시용)
    private String ipAddress;        // 로그인한 IP
    private AdminApproveStatus approveStatus; // PENDING / APPROVED / ...
    private String message;       
}