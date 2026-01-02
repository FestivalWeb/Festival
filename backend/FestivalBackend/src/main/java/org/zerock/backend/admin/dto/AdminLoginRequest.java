package org.zerock.backend.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor // [중요] JSON 파싱을 위한 기본 생성자
@AllArgsConstructor
public class AdminLoginRequest {
    private String username;
    private String password;
}