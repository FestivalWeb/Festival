package org.zerock.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.zerock.backend.dto.UserLoginRequestDto;
import org.zerock.backend.dto.UserLoginResponseDto;
import org.zerock.backend.entity.UserEntity;
import org.zerock.backend.entity.UserSessionEntity;
import org.zerock.backend.exception.LoginException;
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
    private final RestTemplate restTemplate;

    @Value("${kakao.client_id}")
    private String clientId;

    @Value("${kakao.redirect_uri}")
    private String redirectUri;

    // [수정] login 메서드
    @Transactional
    @SuppressWarnings("null")
    public UserLoginResponseDto login(UserLoginRequestDto dto) {
        // 1. 아이디 조회 실패 시
        UserEntity user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new LoginException("존재하지 않는 아이디입니다.")); // LoginException 사용

        // 2. 비밀번호 불일치 시
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new LoginException("비밀번호가 일치하지 않습니다."); // LoginException 사용
        }

        // 3. 이메일 미인증 시
        if (!user.isVerified()) {
             throw new LoginException("이메일 인증이 완료되지 않은 계정입니다."); // LoginException 사용
        }
        
        return createSession(user, "로그인 성공");
    }

    @Transactional
    public UserLoginResponseDto kakaoLogin(String code) {
        // 1. 인가 코드로 액세스 토큰 요청
        String accessToken = getKakaoAccessToken(code);

        // 2. 토큰으로 카카오 사용자 정보 조회
        JsonNode kakaoUserInfo = getKakaoUserInfo(accessToken);

        // 3. 사용자 정보 추출 (ID, 닉네임, 이메일)
        String socialId = kakaoUserInfo.get("id").asText();
        String nickname = kakaoUserInfo.path("properties").path("nickname").asText("Unknown");
        // 이메일은 동의 안하면 없을 수 있음
        String email = kakaoUserInfo.path("kakao_account").path("email").asText(socialId + "@kakao.com"); 

        // 4. 회원가입 또는 로그인 처리
        // socialId로 기존 회원을 찾습니다. (UserEntity에 socialId 필드가 있어야 함!)
        UserEntity user = userRepository.findBySocialId(socialId)
                .orElseGet(() -> {
                    // 없으면 신규 회원가입
                    UserEntity newUser = new UserEntity();
                    newUser.setUserId(nickname); // ID 중복 방지 접두사
                    newUser.setSocialId(socialId);
                    newUser.setProvider("KAKAO");
                    newUser.setName(nickname);
                    newUser.setEmail(email);
                    newUser.setSex("Unknown"); // 필수값이라 임시로 채움
                    newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // 비밀번호 랜덤
                    newUser.setVerified(true); // 소셜 로그인은 이미 인증됨
                    newUser.setRole("USER");
                    return userRepository.save(newUser);
                });

        // 5. 세션 생성 및 반환
        return createSession(user, "카카오 로그인 성공");
    }

    // --- 내부 메서드 (토큰 요청) ---
    @SuppressWarnings("null")
    private String getKakaoAccessToken(String code) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);
        // body.add("client_secret", "보안코드가_있다면_여기_입력"); 

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, request, String.class);
            JsonNode root = new ObjectMapper().readTree(response.getBody());
            return root.path("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("카카오 토큰 발급 실패: " + e.getMessage());
        }
    }

    // --- 내부 메서드 (사용자 정보 요청) ---
    @SuppressWarnings("null")
    private JsonNode getKakaoUserInfo(String accessToken) {
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, request, String.class);
            return new ObjectMapper().readTree(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("카카오 유저 정보 조회 실패: " + e.getMessage());
        }
    }

    // (아래 createSession, getKakaoAccessToken, getKakaoUserInfo 메서드는 기존과 동일)
    // 편의를 위해 createSession만 다시 적어드립니다. 나머지는 기존 코드 유지하세요.

    private UserLoginResponseDto createSession(UserEntity user, String message) {
        String sessionId = UUID.randomUUID().toString();
        String refreshToken = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(1); 

        UserSessionEntity session = new UserSessionEntity();
        session.setSessionId(sessionId);
        session.setUser(user);
        session.setCreatedAt(LocalDateTime.now());
        session.setExpiresAt(expiresAt);
        session.setRefreshToken(refreshToken);
        session.setIpAddress("127.0.0.1");
        session.setUserAgent("Client");
        session.setIsRevoked(false);

        userSessionRepository.save(session);

        return UserLoginResponseDto.builder()
                .token(sessionId)
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole() : "USER")
                // ▼▼▼ [필수 추가] DB에 저장된 provider 값을 꺼내서 담아줍니다. ▼▼▼
                .provider(user.getProvider()) 
                .build();
    }
}
