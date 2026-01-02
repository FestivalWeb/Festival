package org.zerock.backend.admin.dto;

import lombok.Builder;
import lombok.Getter;
import org.zerock.backend.entity.AdminApproveStatus;

import java.time.LocalDateTime;

@Getter
@Builder
public class PendingAdminResponse {

    private Long adminId;
    private String username;
    private String name;
    private String email;

    private boolean active;                     // isActive (대기 중이면 false일 것)
    private AdminApproveStatus approveStatus;   // 보통 PENDING

    private LocalDateTime requestedAt;          // 가입 요청 시간
}