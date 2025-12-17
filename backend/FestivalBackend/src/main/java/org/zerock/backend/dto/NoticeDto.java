package org.zerock.backend.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

public class NoticeDto {

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class CreateRequest {
        private String title;
        private String content;
        private boolean important; // 상단 고정(중요) 여부
        private List<Long> fileIds; // 첨부파일 ID 목록
    }

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Long noticeId;
        private String title;
        private String content;
        private boolean important;
        private long viewCount;
        private String adminName; // 작성자(관리자) 이름
        private LocalDateTime createDate;
        private List<PostImageResponse> images; // 기존에 만든 이미지 DTO 재사용
    }
}