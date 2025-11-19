package org.zerock.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
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

    @Value("${kakao.client.id}")
    private String kakaoClientId;
    
    @Value("${kakao.redirect.uri}")
    private String kakaoRedirectUri;

    // (일반 로그인 메서드 login은 생략 - 기존과 동일)
    @Transactional
    public UserLoginResponseDto login(UserLoginRequestDto dto) {
        UserEntity user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        if (!user.isVerified()) {
             throw new IllegalStateException("인증되지 않은 계정입니다. 이메일 인증을 완료해주세요.");
        }
        
        return createSession(user, "로그인 성공");
    }

    /**
     * 카카오 로그인 로직 (닉네임 파싱 수정됨)
     */
    @Transactional
    public UserLoginResponseDto kakaoLogin(String code) {
        // 1. 인가 코드로 액세스 토큰 요청
        String accessToken = getKakaoAccessToken(code);

        // 2. 토큰으로 카카오 사용자 정보 조회
        JsonNode kakaoUserInfo = getKakaoUserInfo(accessToken);
        
        // 3. ID 추출
        String socialId = kakaoUserInfo.get("id").asText();
        
        // 4. [수정] 닉네임 추출 로직 강화 (profile -> properties 순서로 찾기)
        String nickname = "";
        JsonNode kakaoAccount = kakaoUserInfo.path("kakao_account");
        
        if (kakaoAccount.path("profile").has("nickname")) {
            nickname = kakaoAccount.path("profile").path("nickname").asText();
        } else if (kakaoUserInfo.path("properties").has("nickname")) {
            nickname = kakaoUserInfo.path("properties").path("nickname").asText();
        }
        
        // 그래도 없으면 기본값 설정
        if (nickname.isEmpty()) {
            nickname = "KakaoUser"; 
        }
        
        // 5. 이메일 추출
        String rawEmail = kakaoAccount.path("email").asText();
        String email = (rawEmail == null || rawEmail.isEmpty()) ? socialId + "@kakao.com" : rawEmail;

        // 람다식에서 사용하기 위해 변수 고정
        String finalNickname = nickname; 

        // 6. 회원가입 및 로그인 처리
        UserEntity user = userRepository.findBySocialId(socialId)
                .orElseGet(() -> {
                    UserEntity newUser = new UserEntity();
                    newUser.setUserId("kakao_" + socialId); 
                    newUser.setSocialId(socialId);
                    newUser.setProvider("KAKAO");
                    
                    // [중요] 수정된 닉네임 사용
                    newUser.setName(finalNickname);
                    newUser.setEmail(email);
                    newUser.setSex("Unknown");
                    
                    // 비밀번호 암호화 (보안 필수)
                    newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                    newUser.setVerified(true); 
                    
                    return userRepository.save(newUser);
                });

        return createSession(user, "카카오 로그인 성공");
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
                .userId(user.getUserId())
                .sessionId(sessionId)
                .message(message)
                .build();
    }

    // getKakaoAccessToken, getKakaoUserInfo는 기존 코드 그대로 두세요.
    private String getKakaoAccessToken(String code) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", kakaoClientId);
        body.add("redirect_uri", kakaoRedirectUri);
        body.add("code", code);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, request, String.class);
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            return root.path("access_token").asText();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("카카오 토큰 파싱 실패", e);
        }
    }

    private JsonNode getKakaoUserInfo(String accessToken) {
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, request, String.class);
        try {
            return new ObjectMapper().readTree(response.getBody());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("카카오 유저 정보 파싱 실패", e);
        }
    }
}