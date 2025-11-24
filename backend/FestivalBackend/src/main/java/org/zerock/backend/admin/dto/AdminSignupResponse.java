package org.zerock.backend.admin.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminSignupResponse {

    private Long adminId;
    private String username;
    private String name;
    private String email;
    private boolean active;   // 승인 여부(지금은 항상 false)
}
