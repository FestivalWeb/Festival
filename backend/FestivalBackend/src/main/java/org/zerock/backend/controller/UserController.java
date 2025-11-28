package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.dto.PasswordChangeDto;
import org.zerock.backend.dto.UserProfileResponseDto;
import org.zerock.backend.dto.UserProfileUpdateDto;
import org.zerock.backend.dto.UserSignupRequestDto;
import org.zerock.backend.service.UserService;

import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/check-id")
    public ResponseEntity<String> checkUserId(@RequestParam("userId") String userId) {
        // 중복이면 서비스에서 예외를 던짐 -> GlobalExceptionHandler가 처리 -> 400 에러
        // 사용 가능하면 -> 200 OK + 메시지
        String resultMessage = userService.checkUserIdAvailable(userId);
        return ResponseEntity.ok(resultMessage);
    }

    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        return ResponseEntity.ok(userService.sendVerificationEmail(email));
    }

    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");

        // 틀리면 서비스에서 예외 던짐
        String resultMessage = userService.verifyEmailCode(email, code);
        return ResponseEntity.ok(resultMessage);
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody @Valid UserSignupRequestDto dto) { // @Valid 추가
        userService.signup(dto);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    // 1. 내 정보 조회 (GET /users/me)
    // (실제로는 세션/토큰에서 ID를 꺼내야 하지만, 테스트용으로 param으로 받음)
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponseDto> getMyProfile(@RequestParam("userId") String userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    // 2. 내 정보 수정 (PUT /users/me)
    @PutMapping("/me")
    public ResponseEntity<String> updateMyProfile(@RequestParam("userId") String userId, 
                                                  @RequestBody UserProfileUpdateDto dto) {
        userService.updateUserProfile(userId, dto);
        return ResponseEntity.ok("회원 정보가 수정되었습니다.");
    }

    // 3. 비밀번호 변경 (PUT /users/password)
    @PutMapping("/password")
    public ResponseEntity<String> changePassword(@RequestParam("userId") String userId,
                                                 @RequestBody PasswordChangeDto dto) {
        userService.changePassword(userId, dto);
        return ResponseEntity.ok("비밀번호가 변경되었습니다.");
    }
    
    // 4. 회원 탈퇴 (DELETE /users/me)
    @DeleteMapping("/me")
    public ResponseEntity<String> withdrawUser(@RequestParam("userId") String userId,
                                               @RequestParam("password") String password) {
        userService.deleteUser(userId, password);
        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    }
}