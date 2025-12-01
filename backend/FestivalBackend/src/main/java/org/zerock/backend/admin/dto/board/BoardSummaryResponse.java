package org.zerock.backend.admin.dto.board;

import lombok.Builder;
import lombok.Getter;
import org.zerock.backend.entity.Board;

import java.time.LocalDateTime;

@Getter
@Builder
public class BoardSummaryResponse {

    private Long boardId;
    private String name;
    private String visibility;
    private String status;        // "ACTIVE" / "INACTIVE"
    private String skin;
    private Long postCount;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BoardSummaryResponse from(Board board) {
        String statusStr = board.isStatus() ? "ACTIVE" : "INACTIVE";

        return BoardSummaryResponse.builder()
                .boardId(board.getBoardId())
                .name(board.getName())
                .visibility(board.getVisibility())
                .status(statusStr)
                .skin(board.getSkin())
                .postCount(board.getPostCount())
                .createdById(
                        board.getCreatedBy() != null ? board.getCreatedBy().getAdminId() : null
                ) // AdminUser 필드명에 맞게 수정 필요
                .createdByName(
                        board.getCreatedBy() != null ? board.getCreatedBy().getUsername() : null
                ) // 여기도 실제 필드명에 맞추기
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .build();
    }
}