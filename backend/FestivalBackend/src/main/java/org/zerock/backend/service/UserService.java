package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.dto.PasswordChangeDto;
import org.zerock.backend.dto.UserProfileResponseDto;
import org.zerock.backend.dto.UserProfileUpdateDto;
import org.zerock.backend.dto.UserSignupRequestDto;
import org.zerock.backend.entity.UserEntity;
import org.zerock.backend.repository.UserRepository;
import org.zerock.backend.repository.UserSessionRepository;
import org.zerock.backend.repository.ReservationRepository;
import org.zerock.backend.repository.PostRepository;

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
    private final UserSessionRepository userSessionRepository;

    // [1] 메모리 저장소: 인증번호 저장 (이메일 <-> 인증번호)
    private final Map<String, String> emailCodeMap = new ConcurrentHashMap<>();
    
    // [2] 인증 완료 저장소: 인증된 이메일 기록 (이메일 <-> 성공여부)
    private final Map<String, Boolean> emailVerifiedMap = new ConcurrentHashMap<>();

    private final ReservationRepository reservationRepository;
    private final PostRepository postRepository;

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
    public String verifyEmailCode(String email, String code) {
        String savedCode = emailCodeMap.get(email);

        // 1) 코드가 없거나(만료), 2) 불일치하면 에러
        if (savedCode == null || !savedCode.equals(code)) {
            throw new IllegalArgumentException("인증번호가 일치하지 않거나 만료되었습니다.");
        }

        // 일치하면 인증 완료 처리
        emailVerifiedMap.put(email, true);
        emailCodeMap.remove(email); 
        
        return "이메일 인증이 완료되었습니다."; // 성공 메시지 반환
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
    public String checkUserIdAvailable(String userId) {
        if (userRepository.findById(userId).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다."); // [에러 발생]
        }
        return "사용 가능한 아이디입니다."; // [성공 메시지]
    }

    @SuppressWarnings("null")
    public boolean isUserIdAvailable(String userId) {
        return userRepository.findById(userId).isEmpty();
    }

    /**
     * [1] 마이페이지 정보 조회
     */
    @SuppressWarnings("null")
    public UserProfileResponseDto getUserProfile(String userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        return UserProfileResponseDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .birthDate(user.getBirthDate())
                .sex(user.getSex())
                .nationality(user.getNationality())
                // ▼▼▼ [추가] DB에 있는 provider 값을 DTO에 넣어서 보냅니다. ▼▼▼
                .provider(user.getProvider()) 
                .build();
    }

    /**
     * [2] 회원 정보 수정
     */
     @SuppressWarnings("null")
    @Transactional
    public void updateUserProfile(String userId, UserProfileUpdateDto dto) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        // 변경할 정보만 덮어씌우기 (Dirty Checking으로 자동 저장)
        if(dto.getName() != null) user.setName(dto.getName());
        if(dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        if(dto.getBirthDate() != null) user.setBirthDate(dto.getBirthDate());
        if(dto.getSex() != null) user.setSex(dto.getSex());
        if(dto.getNationality() != null) user.setNationality(dto.getNationality());
        
        // userRepository.save(user); // @Transactional이 있으면 생략 가능하지만 명시해도 됨
    }

    /**
     * [3] 비밀번호 변경
     * 수정됨: 현재 비밀번호와 새 비밀번호가 같으면 변경 불가 처리
     */
    @Transactional
    public void changePassword(String userId, PasswordChangeDto dto) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        if ("KAKAO".equals(user.getProvider())) {
            throw new IllegalArgumentException("카카오 로그인 사용자는 비밀번호를 변경할 수 없습니다.");
        }

        // 1. 현재 비밀번호 확인
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // ▼▼▼ [추가된 로직] 현재 비밀번호와 새 비밀번호가 같은지 확인 ▼▼▼
        if (passwordEncoder.matches(dto.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 사용 중인 비밀번호와 다르게 설정해주세요.");
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        // 2. 새 비밀번호 확인
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("새 비밀번호가 일치하지 않습니다.");
        }

        // 3. 비밀번호 암호화 후 저장
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
    }
    
    /**
     * [4] 회원 탈퇴
     */
    @SuppressWarnings("null")
    @Transactional
    public void deleteUser(String userId, String password) {
         UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));
         
         // 1. 카카오 유저가 아니면 비밀번호 확인
         if (user.getProvider() == null || !user.getProvider().equals("KAKAO")) {
             if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
            }
         }
        
        // 2. [핵심 수정] 자식 데이터들을 먼저 삭제해야 부모(User) 삭제 시 에러가 안 납니다.
        // (순서 중요: 자식들 먼저 -> 마지막에 본인)
        try {
            userSessionRepository.deleteByUserId(userId); // 로그인 세션 삭제
            reservationRepository.deleteByUser_UserId(userId); 
            postRepository.deleteByUser_UserId(userId);        // 작성 게시글 삭제
            // 필요한 경우 댓글(Comment) 등도 여기서 삭제해야 함
        } catch (Exception e) {
            // 혹시 데이터가 없어서 에러나도 무시하고 진행 (선택사항)
            System.out.println("연관 데이터 삭제 중 경고: " + e.getMessage());
        }

        // 3. 마지막으로 회원 정보 삭제
        userRepository.delete(user);
    }

    /**
     * [계정 찾기/비밀번호 찾기용] 인증번호 발송
     * - 가입된 회원이 있어야만 발송됨 (회원가입용과 반대 로직)
     * - type: "ID"(아이디 찾기), "PW"(비밀번호 찾기)
     */
    public String sendRecoveryEmail(String name, String email, String userId, String type) {
        // 1. 이메일로 회원 조회
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        // 2. 이름 일치 확인
        if (!user.getName().equals(name)) {
            throw new IllegalArgumentException("사용자 이름이 일치하지 않습니다.");
        }

        // 3. 비밀번호 찾기일 경우, 아이디도 일치하는지 확인
        if ("PW".equals(type)) {
            if (userId == null || !user.getUserId().equals(userId)) {
                throw new IllegalArgumentException("아이디가 일치하지 않습니다.");
            }
        }

        // 4. 인증번호 생성 및 전송 (기존 로직 재사용)
        String code = String.format("%06d", new Random().nextInt(999999));
        emailCodeMap.put(email, code);
        emailVerifiedMap.put(email, false);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("[논산딸기축제] 본인확인 인증번호입니다.");
            message.setText("인증번호는 [" + code + "] 입니다.");
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException("메일 발송 실패");
        }

        return "인증번호가 발송되었습니다.";
    }

    /**
     * [아이디 찾기] 인증 완료 후 아이디 반환
     */
   public String findUserId(String name, String email, String code) {
        // 1. 인증번호 검증 (틀리면 여기서 에러 발생)
        verifyEmailCode(email, code); 
        
        // 2. 이메일로 유저 찾기
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보가 없습니다."));
        
        // 3. [핵심] 입력한 이름과 DB에 저장된 이름이 같은지 확인
        if (!user.getName().equals(name)) {
            throw new IllegalArgumentException("사용자 이름이 일치하지 않습니다.");
        }

        // 4. 아이디 반환
        return user.getUserId();
    }

    /**
     * [비밀번호 초기화]
     * - 기존 비밀번호 확인 없이 강제로 새 비밀번호로 변경
     * - 아이디 찾기/비밀번호 찾기 인증 후 사용
     */
    @Transactional
    public void resetPassword(String userId, String newPassword) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        // 소셜 로그인 유저인지 체크 (선택사항)
        if ("KAKAO".equals(user.getProvider())) {
            throw new IllegalArgumentException("카카오 회원은 비밀번호를 변경할 수 없습니다.");
        }

        // 기존 비밀번호 확인 과정 없이 바로 덮어쓰기 (Update)
        user.setPassword(passwordEncoder.encode(newPassword));
    }
}