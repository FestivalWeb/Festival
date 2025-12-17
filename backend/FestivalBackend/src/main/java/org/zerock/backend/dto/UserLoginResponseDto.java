package org.zerock.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginResponseDto {
    private String token;
    private String userId;
    private String name;
    private String email;
    private String role;
    
    // ▼▼▼ [필수 추가] 이 줄이 없으면 카카오 여부를 알 수 없습니다! ▼▼▼
    private String provider;
    private String message;
}