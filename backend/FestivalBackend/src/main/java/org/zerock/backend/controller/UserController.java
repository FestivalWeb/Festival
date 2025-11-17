package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.dto.UserSignupRequestDto;
import org.zerock.backend.service.UserService; 

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users") 
public class UserController {

    private final UserService userService;

    
     
    @GetMapping("/check-id")
    public ResponseEntity<Boolean> checkUserId(@RequestParam("userId") String userId) {
       
        return ResponseEntity.ok(userService.isUserIdAvailable(userId));
    }

    
    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        return ResponseEntity.ok(userService.sendVerificationEmail(email));
    }
    
    
    @PostMapping("/verify-code")
    public ResponseEntity<Boolean> verifyCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");
        
        
        boolean isVerified = userService.verifyEmailCode(email, code);
        
        
        return ResponseEntity.ok(isVerified);
    }

    
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserSignupRequestDto dto) {
        
        
        userService.signup(dto);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }
}