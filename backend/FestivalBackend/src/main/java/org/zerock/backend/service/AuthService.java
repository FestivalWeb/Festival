package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.dto.UserLoginRequestDto;
import org.zerock.backend.dto.UserLoginResponseDto;
import org.zerock.backend.entity.UserEntity;
import org.zerock.backend.entity.UserSessionEntity;
import org.zerock.backend.repository.UserRepository;
import org.zerock.backend.repository.UserSessionRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserSessionRepository userSessionRepository;

    @Transactional
    public UserLoginResponseDto login(UserLoginRequestDto dto) {
        // 1. 사용자 ID로 엔티티 조회
        UserEntity user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다."));

        // 2. 비밀번호 검증
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        // 3. 계정 상태 확인
        if (!user.isVerified()) {
             throw new IllegalStateException("인증되지 않은 계정입니다. 이메일 인증을 완료해주세요.");
        }
        
        // 4. 세션 및 토큰 생성
        String sessionId = UUID.randomUUID().toString();
        String refreshToken = UUID.randomUUID().toString(); // [수정] 리프레시 토큰 생성
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(1); 

        UserSessionEntity session = new UserSessionEntity();
        session.setSessionId(sessionId);
        session.setUser(user);
        session.setCreatedAt(LocalDateTime.now());
        session.setExpiresAt(expiresAt);
        session.setRefreshToken(refreshToken); // [수정] DB 저장을 위해 값 설정
        
        // 실제 환경에서는 IP/UserAgent를 파싱해서 넣어야 함 (임시 값)
        session.setIpAddress("127.0.0.1");
        session.setUserAgent("WebClient");
        session.setIsRevoked(false);

        userSessionRepository.save(session);

        // 5. 응답 반환
        return UserLoginResponseDto.builder()
                .userId(user.getUserId())
                .sessionId(sessionId)
                .message("로그인 성공")
                .build();
    }
}