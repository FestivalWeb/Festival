package org.zerock.backend.admin.dto.board;

import lombok.Builder;
import lombok.Getter;
import org.zerock.backend.entity.Post; // (클래스명 post -> Post 권장)

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminPostResponse {

    private Long postId;
    private Long boardId;       // 게시판 ID
    private String boardName;   // 게시판 이름 (예: "공지사항", "자유게시판")
    
    private String title;
    private String content;
    private Long viewCount;
    
    private Long writerId;      // 작성자(관리자) ID
    private String writerName;  // 작성자 이름
    
    private boolean important;  // 중요(상단고정) 여부
    
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    // Entity -> DTO 변환 메서드
    public static AdminPostResponse from(Post entity) {
        return AdminPostResponse.builder()
                .postId(entity.getPostId())
                .boardId(entity.getBoard().getBoardId())
                .boardName(entity.getBoard().getName()) // Board 엔티티 접근
                .title(entity.getTitle())
                .content(entity.getContext()) // 엔티티 필드명이 context라면
                .viewCount(entity.getView())
                .writerId(entity.getAdminId()) 
                // 작성자 이름은 서비스 계층에서 AdminUserRepository로 조회해서 넣거나, 
                // post 엔티티에 연관관계가 있다면 entity.getAdminUser().getName() 사용
                .createDate(entity.getCreateDate())
                .updateDate(entity.getUpdateDate())
                .build();
    }
}