package org.zerock.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

public class PopupDto {

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class CreateRequest {
        private String title;
        private String content;
        private Long priority;      // 우선순위 (높을수록 위)
        private LocalDateTime startAt; // 시작일시
        private LocalDateTime endAt;   // 종료일시
        private Long fileId;        // 팝업 이미지 1개
    }

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Long popupId;
        private String title;
        private String content;
        private String imageUri;    // 이미지 주소
        private Long priority;
        private LocalDateTime startAt;
        private LocalDateTime endAt;
    }
}