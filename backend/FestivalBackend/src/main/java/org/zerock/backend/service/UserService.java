package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.dto.UserSignupRequestDto;
import org.zerock.backend.entity.UserEntity;
import org.zerock.backend.repository.UserRepository;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    // [1] 메모리 저장소: 인증번호 저장 (이메일 <-> 인증번호)
    private final Map<String, String> emailCodeMap = new ConcurrentHashMap<>();
    
    // [2] 인증 완료 저장소: 인증된 이메일 기록 (이메일 <-> 성공여부)
    private final Map<String, Boolean> emailVerifiedMap = new ConcurrentHashMap<>();

    /**
     * 이메일 인증번호 발송
     */
    public String sendVerificationEmail(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        // 6자리 랜덤 코드 생성
        String code = String.format("%06d", new Random().nextInt(999999));

        // 메모리에 저장 (나중에 검사할 때 씀)
        emailCodeMap.put(email, code);
        emailVerifiedMap.put(email, false); // 아직 인증 안 됨

        // 메일 발송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[세계딸기축제] 회원가입 인증번호입니다.");
        message.setText("인증번호: " + code);
        mailSender.send(message);

        return "인증번호가 발송되었습니다.";
    }

    /**
     * 인증번호 검증
     */
    public boolean verifyEmailCode(String email, String code) {
        String savedCode = emailCodeMap.get(email);

        // 저장된 코드와 입력 코드가 일치하면
        if (savedCode != null && savedCode.equals(code)) {
            emailVerifiedMap.put(email, true); // [중요] 인증 성공 도장 찍기!
            emailCodeMap.remove(email); 
            return true;
        }
        return false;
    }

    /**
     * 회원가입 (최종 저장)
     */
    @Transactional
    @SuppressWarnings("null")
    public UserEntity signup(UserSignupRequestDto dto) {

        // 1. 약관 동의 확인
        if (!dto.isTermsOfServiceAgreed() || !dto.isPrivacyPolicyAgreed()) {
            throw new IllegalArgumentException("필수 이용약관에 동의해야 합니다.");
        }

        // 2. 아이디 중복 확인
        if (userRepository.findById(dto.getUserId()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // ▼▼▼ [핵심 추가] 이 부분이 없어서 그냥 가입된 겁니다! ▼▼▼
        // 3. 이메일 인증 여부 확인 (검문소)
        // 인증 성공 도장(true)이 없으면 에러를 내서 쫓아냅니다.
        if (!emailVerifiedMap.getOrDefault(dto.getEmail(), false)) {
            throw new IllegalArgumentException("이메일 인증이 완료되지 않았습니다.");
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        // 4. 저장 로직
        var user = new UserEntity();
        user.setUserId(dto.getUserId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setSex(dto.getSex());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setVerified(true);

        // 가입했으니 인증 기록 삭제 (메모리 정리)
        emailVerifiedMap.remove(dto.getEmail());

        return userRepository.save(user);
    }

    @SuppressWarnings("null")
    public boolean isUserIdAvailable(String userId) {
        return userRepository.findById(userId).isEmpty();
    }
}