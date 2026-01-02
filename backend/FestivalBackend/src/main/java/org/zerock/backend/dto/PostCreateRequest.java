package org.zerock.backend.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostCreateRequest {
    // 게시글 제목
    private String title;

    // 게시글 내용 (엔티티 필드명이 context라서 이름을 맞춰줌)
    private String context;

    // [추가] 게시판 ID (어느 게시판에 쓸지)
    private Long boardId;

    // 첨부된 media_file의 PK 목록
    private List<Long> fileIds;
}
