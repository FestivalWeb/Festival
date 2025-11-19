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

import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본적으로 읽기 전용 트랜잭션 적용
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    /**
     * 회원가입 처리
     */
    @Transactional // 데이터 변경(저장)이 일어나므로 트랜잭션 허용
    public UserEntity signup(UserSignupRequestDto dto) {

        // 1. 약관 동의 확인
        if (!dto.isTermsOfServiceAgreed() || !dto.isPrivacyPolicyAgreed()) {
            throw new IllegalArgumentException("필수 이용약관에 동의해야 합니다.");
        }

        // 2. 아이디 중복 확인
        if (userRepository.findById(dto.getUserId()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // 3. 엔티티 생성 (Java 17 'var' 사용)
        var user = new UserEntity();
        user.setUserId(dto.getUserId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setSex(dto.getSex());

        // 4. 비밀번호 암호화
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        
        // 5. 계정 활성화 (이메일 인증 로직에 따라 false로 시작할 수도 있음)
        user.setVerified(true);

        // 6. 저장
        return userRepository.save(user);
    }

    /**
     * 아이디 중복 검사
     */
    public boolean isUserIdAvailable(String userId) {
        return userRepository.findById(userId).isEmpty();
    }

    /**
     * 인증 이메일 발송
     */
    public String sendVerificationEmail(String email) {
        // 6자리 랜덤 인증번호 생성
        var code = String.format("%06d", new Random().nextInt(999999));

        // 이메일 메시지 생성
        var message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[세계딸기축제] 회원가입 인증번호입니다.");
        message.setText("인증번호: " + code);
        
        // 메일 발송
        mailSender.send(message);

        // TODO: 실제 운영 환경에서는 생성된 'code'를 Redis나 DB에 저장해야 검증이 가능합니다.
        // 현재는 발송 성공 메시지만 반환합니다.
        return "인증번호가 발송되었습니다.";
    }

    /**
     * 이메일 인증번호 검증
     */
    public boolean verifyEmailCode(String email, String code) {
        // TODO: 저장된 인증번호와 파라미터로 받은 'code'를 비교하는 로직 구현 필요
        // 현재는 무조건 성공으로 처리
        return true;
    }
}