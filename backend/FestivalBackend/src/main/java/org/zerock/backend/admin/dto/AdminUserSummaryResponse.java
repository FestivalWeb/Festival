package org.zerock.backend.admin.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class AdminUserSummaryResponse {

    private Long adminId;
    private String username;
    private String name;
    private String email;
    private List<String> roles;
    private String status;           // "ACTIVE" / "INACTIVE" 같은 라벨
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}
