package org.zerock.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostSummaryResponse {

    private Long postId;
    private String title;
    private String userId;          // 작성자 ID
    private Long view;              // 조회수 
    private LocalDateTime createDate;

    // 썸네일용으로 첫 번째 이미지 id만 내려주고 싶다면 (없어도 됨)
    private Long thumbnailFileId;
    private String thumbnailUri;
}
