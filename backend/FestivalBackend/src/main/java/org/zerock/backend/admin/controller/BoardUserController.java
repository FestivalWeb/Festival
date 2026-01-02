package org.zerock.backend.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.admin.dto.board.BoardSummaryResponse;
import org.zerock.backend.admin.service.BoardUserService;

import java.util.List;

@RestController
@RequestMapping("/api/boards") // ★ 여기가 핵심! 프론트가 요청하는 주소
@RequiredArgsConstructor
public class BoardUserController {

    private final BoardUserService boardUserService;

    // 메뉴용 게시판 목록 조회
    @GetMapping
    public List<BoardSummaryResponse> getActiveBoards() {
        return boardUserService.getActiveBoards();
    }

    // 특정 게시판 정보 조회 (게시판 들어갔을 때 제목 등)
    @GetMapping("/{boardId}")
    public BoardSummaryResponse getBoardInfo(@PathVariable Long boardId) {
        return boardUserService.getBoardInfo(boardId);
    }
}