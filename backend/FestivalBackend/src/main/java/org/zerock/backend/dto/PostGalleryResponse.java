package org.zerock.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PostGalleryResponse {
    private Long fileId;      // 이미지 ID
    private String imageUri;  // 이미지 주소 (화면에 보여줄 것)
    private String title;     // 게시글 제목
    private String writer;    // 작성자 ID (누가 썼는지)
    private Long postId;      // 클릭하면 해당 글(상세페이지)로 이동하려고
}