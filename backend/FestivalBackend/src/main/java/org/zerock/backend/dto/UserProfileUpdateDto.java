package org.zerock.backend.dto;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter
public class UserProfileUpdateDto {
    private String name;        // 이름 (또는 닉네임)
    private String phoneNumber;
    private LocalDate birthDate;
    private String sex;
    private String nationality;
    // 아이디와 이메일은 보통 변경 불가하므로 제외
}