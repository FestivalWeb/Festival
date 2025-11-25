package org.zerock.backend.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDetailResponse {

    private Long postId;
    private String title;
    private String context;
    private String userId;
    private Long view;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    // 첨부 이미지 id 리스트
    private List<PostImageResponse> images;
}
