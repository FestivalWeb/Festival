package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.backend.dto.UserLoginRequestDto;
import org.zerock.backend.dto.UserLoginResponseDto;
import org.zerock.backend.service.AuthService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth") // 인증/인가 관련 컨트롤러는 /auth로 매핑하는 것이 일반적
public class AuthController {

    private final AuthService authService;

    /**
     * 사용자 로그인 처리
     * @param dto 로그인 요청 정보 (아이디, 비밀번호)
     * @return 로그인 성공 시 세션 정보 등을 포함한 응답
     */
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> login(@RequestBody UserLoginRequestDto dto) {
        
        try {
            UserLoginResponseDto response = authService.login(dto);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // 아이디 또는 비밀번호 불일치 처리
            // 보안을 위해 "아이디 또는 비밀번호가 올바르지 않습니다."라는 통일된 메시지를 사용합니다.
            UserLoginResponseDto errorResponse = UserLoginResponseDto.builder()
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (IllegalStateException e) {
             // 기타 계정 상태 오류 처리 (예: 미인증 계정)
             UserLoginResponseDto errorResponse = UserLoginResponseDto.builder()
                    .message(e.getMessage())
                    .build();
             return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}