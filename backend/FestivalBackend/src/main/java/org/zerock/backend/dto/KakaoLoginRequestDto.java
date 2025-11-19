package org.zerock.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KakaoLoginRequestDto {
    private String code; // 카카오 로그인 후 받은 인가 코드
}