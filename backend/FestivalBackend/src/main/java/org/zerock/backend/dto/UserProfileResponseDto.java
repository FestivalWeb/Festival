package org.zerock.backend.dto;
import lombok.*;
import java.time.LocalDate;

@Getter @Builder
public class UserProfileResponseDto {
    private String userId;
    private String name;
    private String email;
    private String phoneNumber;
    private LocalDate birthDate;
    private String sex;
    private String nationality;
}