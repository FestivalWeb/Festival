package org.zerock.backend.admin.dto.board;

import lombok.Builder;
import lombok.Getter;
import org.zerock.backend.entity.Post; // post 엔티티

import java.time.LocalDateTime;

@Getter
@Builder
public class PostResponse {
    private Long postId;
    private String title;
    private String writerName; // 작성자 (관리자 or 유저ID)
    private Long viewCount;
    private LocalDateTime createDate;

    public static PostResponse from(Post entity) {
        // 작성자 표시 로직 (adminId가 있으면 "관리자", 아니면 userId)
        String writer = (entity.getAdminId() != null) ? "관리자" : entity.getUserId();
        if (writer == null) writer = "익명";

        return PostResponse.builder()
                .postId(entity.getPostId())
                .title(entity.getTitle())
                .writerName(writer)
                .viewCount(entity.getView())
                .createDate(entity.getCreateDate())
                .build();
    }
}