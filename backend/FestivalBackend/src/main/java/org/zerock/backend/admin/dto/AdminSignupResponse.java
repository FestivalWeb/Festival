package org.zerock.backend.admin.dto;

import org.zerock.backend.entity.AdminApproveStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminSignupResponse {

    private Long adminId;
    private String username;
    private String name;
    private String email;
    private boolean active;
    private AdminApproveStatus approveStatus; // PENDING / APPROVED / ...
    private String message;
}