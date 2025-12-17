package org.zerock.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponseDto {
    private String userId;
    private String name;
    private String email;
    private String phoneNumber;
    private LocalDate birthDate;
    private String sex;
    private String nationality;
    
    // ▼▼▼ [추가] 이 줄을 꼭 넣어주세요! ▼▼▼
    private String provider; 
}