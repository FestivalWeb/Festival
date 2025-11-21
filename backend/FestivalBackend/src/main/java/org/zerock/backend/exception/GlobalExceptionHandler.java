package org.zerock.backend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

// @RestControllerAdvice: 모든 컨트롤러(RestController)에서 발생하는 예외를 여기서 잡겠다! 라는 뜻입니다.
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 1. 비즈니스 로직 예외 처리 (우리가 직접 throw한 것들)
     * 예: 아이디 중복, 이메일 미인증 등
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        // 400 Bad Request 상태코드와 함께 에러 메시지 반환
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    /**
     * 2. 유효성 검사 실패 처리 (@Valid 통과 못한 것들)
     * 예: 빈칸 입력, 이메일 형식이 아님 등
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        
        // 에러가 난 필드명(key)과 에러 메시지(value)를 맵에 담아서 반환
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage()));
            
        return ResponseEntity.badRequest().body(errors);
    }
}