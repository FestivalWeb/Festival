package org.zerock.backend.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor // [필수] JSON 변환을 위한 기본 생성자
@AllArgsConstructor
public class AdminSignupRequest {

    private String username;
    private String name;
    private String password;
    private String email;
}