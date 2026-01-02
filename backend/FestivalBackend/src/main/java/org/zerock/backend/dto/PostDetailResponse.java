package org.zerock.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat; // [필수] 임포트
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class PostDetailResponse {

    private Long postId;
    private String title;
    private String context;
    private String userId;
    private Long view;

    // [수정] 여기도 똑같이 붙여줍니다.
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updateDate;

    private List<PostImageResponse> images;
}