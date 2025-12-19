package org.zerock.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat; // [필수] 임포트
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class PostSummaryResponse {

    private Long postId;
    private String title;
    private String userId;
    private Long view;

    // [수정] 날짜 형식을 문자열로 고정!
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createDate;

    private Long thumbnailFileId;
    private String thumbnailUri;
}