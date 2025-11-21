package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.dto.UserLoginRequestDto;
import org.zerock.backend.dto.UserLoginResponseDto;
import org.zerock.backend.service.AuthService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    // 일반 로그인
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> login(@RequestBody UserLoginRequestDto dto) {
        try {
            UserLoginResponseDto response = authService.login(dto);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(UserLoginResponseDto.builder().message(e.getMessage()).build());
        }
    }

    // [중요] 이 메서드가 'class' 괄호 안에 바로 있어야 합니다! (내부 클래스 금지)
    @GetMapping("/kakao/callback")
    public ResponseEntity<UserLoginResponseDto> kakaoLogin(@RequestParam("code") String code) {
        UserLoginResponseDto response = authService.kakaoLogin(code);
        return ResponseEntity.ok(response);
    }
}