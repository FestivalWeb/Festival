package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.dto.PasswordChangeDto;
import org.zerock.backend.dto.UserProfileResponseDto;
import org.zerock.backend.dto.UserProfileUpdateDto;
import org.zerock.backend.dto.UserSignupRequestDto;
import org.zerock.backend.entity.Booth;
import org.zerock.backend.entity.Reservation;
import org.zerock.backend.entity.UserEntity;
import org.zerock.backend.repository.*;

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
    
    // [추가] 부스 정보 수정을 위해 필요
    private final BoothRepository boothRepository;

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

        // 3. 이메일 인증 여부 확인
        if (!emailVerifiedMap.getOrDefault(dto.getEmail(), false)) {
            throw new IllegalArgumentException("이메일 인증이 완료되지 않았습니다.");
        }

        // 4. 저장 로직
        var user = new UserEntity();
        user.setUserId(dto.getUserId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setSex(dto.getSex());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setVerified(true);

        // 가입했으니 인증 기록 삭제
        emailVerifiedMap.remove(dto.getEmail());

        return userRepository.save(user);
    }

    @SuppressWarnings("null")
    public String checkUserIdAvailable(String userId) {
        if (userRepository.findById(userId).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        return "사용 가능한 아이디입니다.";
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

        if(dto.getName() != null) user.setName(dto.getName());
        if(dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        if(dto.getBirthDate() != null) user.setBirthDate(dto.getBirthDate());
        if(dto.getSex() != null) user.setSex(dto.getSex());
        if(dto.getNationality() != null) user.setNationality(dto.getNationality());
    }

    /**
     * [3] 비밀번호 변경
     */
    @Transactional
    @SuppressWarnings("null")
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

        // 2. 현재 비밀번호와 새 비밀번호가 같은지 확인
        if (passwordEncoder.matches(dto.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 사용 중인 비밀번호와 다르게 설정해주세요.");
        }

        // 3. 새 비밀번호 확인
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("새 비밀번호가 일치하지 않습니다.");
        }

        // 4. 비밀번호 암호화 후 저장
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
    }
    
    /**
     * [4] 회원 탈퇴
     * [수정] 탈퇴 시 예약했던 부스 인원 복구 로직 추가
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
        
        // 2. 자식 데이터 삭제 전 처리 (예약 인원 복구 등)
        try {
            // [핵심 추가] 이 유저의 모든 예약 정보를 가져와서 부스 인원 복구
            Page<Reservation> reservations = reservationRepository.findByUser_UserIdOrderByReserDateDesc(userId, Pageable.unpaged());
            
            for (Reservation r : reservations) {
                Booth booth = r.getBooth();
                long current = booth.getCurrentPerson() == null ? 0L : booth.getCurrentPerson();
                long count = r.getCount();
                
                // 인원 차감 (0보다 작아지지 않게)
                long newCount = (current >= count) ? (current - count) : 0L;
                
                booth.setCurrentPerson(newCount);
                booth.setStatus(true); // 자리가 났으니 다시 예약 가능 상태로
                boothRepository.save(booth);
            }

            // 이제 데이터 삭제
            userSessionRepository.deleteByUserId(userId); 
            reservationRepository.deleteByUser_UserId(userId); 
            postRepository.deleteByUser_UserId(userId);        
            
        } catch (Exception e) {
            System.out.println("연관 데이터 삭제 중 오류: " + e.getMessage());
        }

        // 3. 마지막으로 회원 정보 삭제
        userRepository.delete(user);
    }

    /**
     * [계정 찾기/비밀번호 찾기용] 인증번호 발송
     */
    public String sendRecoveryEmail(String name, String email, String userId, String type) {
        
        // 1. 이메일로 회원 조회
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("입력하신 정보와 일치하는 회원이 없습니다."));

        // [중요] 카카오 회원 체크 (여기서 확실하게 막습니다!)
        String provider = user.getProvider();
        if (provider != null && (provider.equalsIgnoreCase("KAKAO") || provider.contains("kakao"))) {
            throw new IllegalArgumentException("카카오로 가입된 계정입니다. 카카오 로그인을 이용해주세요.");
        }

        // 2. 이름 일치 확인
        if (!user.getName().equals(name)) {
            throw new IllegalArgumentException("입력하신 정보와 일치하는 회원이 없습니다.");
        }

        // 3. (비밀번호 찾기일 때) 아이디 일치 확인
        if ("PW".equals(type)) {
            if (userId == null || !user.getUserId().equals(userId)) {
                throw new IllegalArgumentException("입력하신 정보와 일치하는 회원이 없습니다.");
            }
        }

        // 4. 인증번호 생성
        String code = String.format("%06d", new java.util.Random().nextInt(999999));

        // ▼▼▼ [수정] 에러 나던 부분을 '메모리 저장' 코드로 변경! ▼▼▼
        emailCodeMap.put(email, code); // 인증번호를 메모리에 저장
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        // 5. 메일 발송
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("[세계딸기축제] 아이디/비밀번호 찾기 인증번호");
            message.setText("인증번호는 [" + code + "] 입니다.");
            
            mailSender.send(message); // 메일 전송
        } catch (Exception e) {
            // 메일 발송 실패 시 맵에서 삭제
            emailCodeMap.remove(email);
            throw new IllegalStateException("메일 발송 중 오류가 발생했습니다.");
        }

        return "인증번호가 발송되었습니다.";
    }

    /**
     * [아이디 찾기] 인증 완료 후 아이디 반환
     */
   public String findUserId(String name, String email, String code) {
        verifyEmailCode(email, code); 
        
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보가 없습니다."));
        
        if (!user.getName().equals(name)) {
            throw new IllegalArgumentException("사용자 이름이 일치하지 않습니다.");
        }

        return user.getUserId();
    }

    /**
     * [비밀번호 초기화]
     */
    @Transactional
    @SuppressWarnings("null")
    public void resetPassword(String userId, String newPassword) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        if ("KAKAO".equals(user.getProvider())) {
            throw new IllegalArgumentException("카카오 회원은 비밀번호를 변경할 수 없습니다.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
    }
}