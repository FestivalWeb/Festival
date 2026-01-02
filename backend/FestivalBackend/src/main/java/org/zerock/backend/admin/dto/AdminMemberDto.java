package org.zerock.backend.admin.dto;

import lombok.*;
import org.zerock.backend.entity.UserEntity;

public class AdminMemberDto {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Summary {
        private String userId;
        private String name;
        private String email;
        private String phoneNumber;
        private String provider; // KAKAO or null
        private boolean isActive; // 활성 상태

        public static Summary from(UserEntity user) {
            return Summary.builder()
                    .userId(user.getUserId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .phoneNumber(user.getPhoneNumber())
                    .provider(user.getProvider())
                    .isActive(user.isActive()) // UserEntity에 추가한 필드
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    public static class StatusRequest {
        private boolean active; // 변경할 상태값 (true/false)
    }
}