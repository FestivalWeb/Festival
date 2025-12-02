package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.dto.UserLoginRequestDto;
import org.zerock.backend.dto.UserLoginResponseDto;
import org.zerock.backend.service.AuthService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    // [수정] try-catch를 모두 제거했습니다!
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> login(@RequestBody UserLoginRequestDto dto, HttpSession session) {
        // 서비스가 알아서 예외를 던지면 -> GlobalExceptionHandler가 받아서 처리함
        // 컨트롤러는 "성공했을 때"만 신경 쓰면 됨
        UserLoginResponseDto response = authService.login(dto);
        session.setAttribute("LOGIN_USER_ID", response.getUserId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/kakao/callback")
    public ResponseEntity<UserLoginResponseDto> kakaoLogin(@RequestParam("code") String code, HttpSession session) {
        UserLoginResponseDto response = authService.kakaoLogin(code);
        session.setAttribute("LOGIN_USER_ID", response.getUserId());
        return ResponseEntity.ok(response);
    }
}