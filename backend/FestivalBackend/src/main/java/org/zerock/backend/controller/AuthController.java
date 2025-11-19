package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.backend.dto.KakaoLoginRequestDto;
import org.zerock.backend.dto.UserLoginRequestDto;
import org.zerock.backend.dto.UserLoginResponseDto;
import org.zerock.backend.service.AuthService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth") 
public class AuthController {

    private final AuthService authService;

    /**
     * 일반 로그인 (ID/PW)
     */
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> login(@RequestBody UserLoginRequestDto dto) {
        try {
            UserLoginResponseDto response = authService.login(dto);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            UserLoginResponseDto errorResponse = UserLoginResponseDto.builder()
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (IllegalStateException e) {
             UserLoginResponseDto errorResponse = UserLoginResponseDto.builder()
                    .message(e.getMessage())
                    .build();
             return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * [추가] 카카오 로그인 (인가 코드 방식)
     * 백엔드에서 인가 코드로 토큰 발급 -> 사용자 정보 조회 -> 로그인/회원가입 처리
     */
    @PostMapping("/login/kakao")
    public ResponseEntity<UserLoginResponseDto> kakaoLogin(@RequestBody KakaoLoginRequestDto dto) {
        // 예외 처리는 필요에 따라 추가 (try-catch)
        UserLoginResponseDto response = authService.kakaoLogin(dto.getCode());
        return ResponseEntity.ok(response);
    }
}