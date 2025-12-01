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
    private boolean active;
}