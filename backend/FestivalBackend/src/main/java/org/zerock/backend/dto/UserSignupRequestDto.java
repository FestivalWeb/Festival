package org.zerock.backend.dto;

import jakarta.validation.constraints.NotBlank; // [중요] 유효성 검사를 위한 import
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignupRequestDto {

    @NotBlank(message = "이름은 필수 입력값입니다.")
    private String name;

    @NotBlank(message = "아이디는 필수 입력값입니다.")
    private String userId;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    private String password;

    @NotBlank(message = "이메일은 필수 입력값입니다.")
    private String email;

    @NotBlank(message = "성별은 필수 입력값입니다.")
    private String sex;

    private String nationality; 

    // 약관 동의 여부
    private boolean termsOfServiceAgreed; 
    private boolean privacyPolicyAgreed;  
    private boolean marketingOptIn;       
}