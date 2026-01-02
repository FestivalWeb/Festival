package org.zerock.backend.admin.dto.board;

import lombok.Builder;
import lombok.Getter;
import org.zerock.backend.entity.Post;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminPostResponse {

    private Long postId;
    private Long boardId;       
    private String boardName;   
    
    private String title;
    private String content;
    private Long viewCount;
    
    private Long writerId;      
    private String writerName;  
    
    private boolean important;  
    
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    // Entity -> DTO 변환 메서드
    public static AdminPostResponse from(Post entity) {
        // 1. 작성자 이름 안전하게 가져오기
        String actualWriterName = "알 수 없음";
        if (entity.getUser() != null) {
            actualWriterName = entity.getUser().getName();
        } else if (entity.getAdminUser() != null) {
            actualWriterName = entity.getAdminUser().getName();
        }

        // [핵심 수정] 게시판(Board)이 null일 경우 에러 방지 처리
        Long bId = null;
        String bName = "미지정(삭제됨)";

        if (entity.getBoard() != null) {
            bId = entity.getBoard().getBoardId();
            bName = entity.getBoard().getName();
        }

        return AdminPostResponse.builder()
                .postId(entity.getPostId())
                .boardId(bId)       // null 허용
                .boardName(bName)   // 게시판 없으면 "미지정" 출력
                .title(entity.getTitle())
                .content(entity.getContext())
                .viewCount(entity.getView())
                .writerId(entity.getAdminId()) 
                .writerName(actualWriterName)
                .createDate(entity.getCreateDate())
                .updateDate(entity.getUpdateDate())
                .build();
    }
}