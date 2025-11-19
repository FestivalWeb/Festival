package org.zerock.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserLoginResponseDto {

    private String userId;
    private String sessionId; // 로그인 성공 시 발급된 세션 ID 또는 JWT 등
    private String message;
}