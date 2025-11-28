package org.zerock.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern; // 추가
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignupRequestDto {

    @NotBlank(message = "이름은 필수 입력값입니다.")
    private String name;

    // [수정] 아이디: 영문/숫자 8자 이상 (DB 컬럼 길이에 맞춰 최대 30자 제한 둠)
    @NotBlank(message = "아이디는 필수 입력값입니다.")
    @Pattern(regexp = "^[a-zA-Z0-9]{8,30}$", message = "아이디는 영문/숫자 포함 8~30자여야 합니다.")
    private String userId;

    // [수정] 비밀번호: 영문/숫자/특수문자 포함 8자 이상
    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$", 
             message = "비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.")
    private String password;

    @NotBlank(message = "이메일은 필수 입력값입니다.")
    private String email;

    @NotBlank(message = "성별은 필수 입력값입니다.")
    private String sex;

    private String nationality; 
    private boolean termsOfServiceAgreed; 
    private boolean privacyPolicyAgreed;  
    private boolean marketingOptIn;       
}