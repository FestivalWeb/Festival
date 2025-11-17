package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.zerock.backend.dto.UserSignupRequestDto; 
import org.zerock.backend.entity.UserEntity;
import org.zerock.backend.repository.UserRepository; 

import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

   
    public UserEntity signup(UserSignupRequestDto dto) {

        
        if (!dto.isTermsOfServiceAgreed() || !dto.isPrivacyPolicyAgreed()) {
          
            throw new IllegalArgumentException("필수 이용약관에 동의해야 합니다.");
        }

        
        if (userRepository.findById(dto.getUserId()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        
      
        UserEntity user = new UserEntity();
        user.setUserId(dto.getUserId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setSex(dto.getSex());
        
       
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        
      
        user.setVerified(true); 

        

        return userRepository.save(user);
    }

   
    public boolean isUserIdAvailable(String userId) {
        return userRepository.findById(userId).isEmpty();
    }

    
    public String sendVerificationEmail(String email) {
        String code = String.format("%06d", new Random().nextInt(999999));

        

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[세계딸기축제] 회원가입 인증번호입니다.");
        message.setText("인증번호: " + code);
        mailSender.send(message);

        return "인증번호가 발송되었습니다.";
    }

    
    public boolean verifyEmailCode(String email, String code) {
       
        
        return true;
    }
}