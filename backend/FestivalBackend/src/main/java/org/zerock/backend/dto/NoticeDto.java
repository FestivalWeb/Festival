package org.zerock.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class NoticeDto {

    @Getter
    @Setter
    @NoArgsConstructor
    public static class CreateRequest {
        private String title;
        private String content;
        private boolean important;
        private List<Long> fileIds;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Response {
        private Long noticeId;
        private String title;
        private String content;
        private boolean important;

        // [원복] view -> viewCount (프론트엔드 호환성)
        private Long viewCount;

        // [원복] regDate -> createDate (프론트엔드 호환성)
        // 날짜 포맷은 유지 (화면에 예쁘게 나오도록)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
        private LocalDateTime createDate;

        private String writer; // 작성자 (adminName 대신 writer 사용은 유지)
        private List<PostImageResponse> images;
    }
}