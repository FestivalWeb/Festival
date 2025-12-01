package org.zerock.backend.admin.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.admin.dto.board.BoardBulkDeleteRequest;
import org.zerock.backend.admin.dto.board.BoardCreateRequest;
import org.zerock.backend.admin.dto.board.BoardStatusUpdateRequest;
import org.zerock.backend.admin.dto.board.BoardSummaryResponse;
import org.zerock.backend.admin.dto.board.BoardUpdateRequest;
import org.zerock.backend.admin.service.BoardAdminService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/boards")
@RequiredArgsConstructor
public class BoardAdminController {

    private final BoardAdminService boardAdminService;

    /** 게시판 목록 (관리자용 전체) */
    @GetMapping
    public List<BoardSummaryResponse> getBoardList() {
        return boardAdminService.getBoardList();
    }

    /** 게시판 단건 조회 */
    @GetMapping("/{boardId}")
    public BoardSummaryResponse getBoard(@PathVariable Long boardId) {
        return boardAdminService.getBoard(boardId);
    }

    /** 게시판 생성 */
    @PostMapping
    public BoardSummaryResponse createBoard(
            @Valid @RequestBody BoardCreateRequest request,
            HttpServletRequest httpRequest
    ) {
        return boardAdminService.createBoard(request, httpRequest);
    }

    /** 게시판 수정 */
    @PutMapping("/{boardId}")
    public BoardSummaryResponse updateBoard(
            @PathVariable Long boardId,
            @Valid @RequestBody BoardUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        return boardAdminService.updateBoard(boardId, request, httpRequest);
    }

    /** 게시판 삭제 (소프트 삭제: status=false) */
    @DeleteMapping("/{boardId}")
    public void deleteBoard(
            @PathVariable Long boardId,
            HttpServletRequest httpRequest
    ) {
        boardAdminService.deleteBoard(boardId, httpRequest);
    }

    /** 게시판 상태 변경 (1건씩) */
    @PatchMapping("/{boardId}/status")
    public void changeBoardStatus(
            @PathVariable Long boardId,
            @RequestBody BoardStatusUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        boardAdminService.changeBoardStatus(boardId, request.isStatus(), httpRequest);
    }

    /** 게시판 여러 개 삭제 (다건) */
    @DeleteMapping("/bulk-delete")
    public void deleteBoardsBulk(
            @RequestBody BoardBulkDeleteRequest request,
            HttpServletRequest httpRequest
    ) {
        boardAdminService.deleteBoardsBulk(request.getBoardIds(), httpRequest);
    }
    
}