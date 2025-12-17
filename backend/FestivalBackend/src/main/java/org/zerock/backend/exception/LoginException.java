package org.zerock.backend.exception;

// RuntimeException을 상속받아 실행 중 발생하는 예외로 만듭니다.
public class LoginException extends RuntimeException {
    public LoginException(String message) {
        super(message);
    }
}