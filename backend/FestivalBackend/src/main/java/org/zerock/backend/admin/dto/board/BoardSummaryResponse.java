package org.zerock.backend.admin.dto.board;

import jakarta.persistence.EntityNotFoundException;
import lombok.Builder;
import lombok.Getter;
import org.zerock.backend.entity.Board;

import java.time.LocalDateTime;

@Getter
@Builder
public class BoardSummaryResponse {

    private Long boardId;
    private String name;
    private String readRole;
    private String writeRole;
    private String status;        // "ACTIVE" / "INACTIVE"
    private String skin;
    private Long postCount;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BoardSummaryResponse from(Board board, long realPostCount) {
        // [수정] Board 엔티티의 status 필드는 isStatus()로 접근
        String statusStr = board.isStatus() ? "ACTIVE" : "INACTIVE";

        // [추가] 삭제된 관리자(DB 불일치) 참조 시 에러 방지를 위한 안전 변수
        Long safeCreatedById = null;
        String safeCreatedByName = null;

        try {
            // getCreatedBy()가 null이 아니어도 실제 DB 조회 시 데이터가 없으면 EntityNotFoundException 발생 가능
            if (board.getCreatedBy() != null) {
                safeCreatedById = board.getCreatedBy().getAdminId();
                safeCreatedByName = board.getCreatedBy().getUsername();
            }
        } catch (EntityNotFoundException e) {
            // DB에 ID는 남아있지만 실제 AdminUser가 없는 경우 처리
            safeCreatedByName = "삭제된 관리자";
        }

        return BoardSummaryResponse.builder()
                .boardId(board.getBoardId())
                .name(board.getName())
                .readRole(board.getReadRole())
                .writeRole(board.getWriteRole())
                .status(statusStr)
                .skin(board.getSkin())
                .postCount(realPostCount)
                .createdById(safeCreatedById)
                .createdByName(safeCreatedByName)
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .build();
    }
}