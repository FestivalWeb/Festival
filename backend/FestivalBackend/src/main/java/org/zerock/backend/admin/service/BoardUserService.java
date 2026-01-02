package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.board.BoardSummaryResponse;
import org.zerock.backend.entity.Board;
import org.zerock.backend.repository.BoardRepository;
import org.zerock.backend.repository.PostRepository; // [추가]

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardUserService {

    private final BoardRepository boardRepository;
    private final PostRepository postRepository; // [추가] 게시글 수를 위해 주입

    // 1. 활성화된 게시판 목록 조회 (메뉴용)
    public List<BoardSummaryResponse> getActiveBoards() {
        List<Board> boards = boardRepository.findAll();

        return boards.stream()
                .filter(Board::isStatus) // 활성 상태인 것만
                // [수정] 람다 블록으로 변경하여 count 계산 후 전달
                .map(board -> {
                    long count = postRepository.countByBoard(board);
                    return BoardSummaryResponse.from(board, count);
                })
                .collect(Collectors.toList());
    }

    // 2. 게시판 단건 조회 (제목 표시용)
    public BoardSummaryResponse getBoardInfo(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시판입니다."));

        if (!board.isStatus()) {
            throw new IllegalArgumentException("운영 중지된 게시판입니다.");
        }

        // [수정] count 계산 후 전달
        long count = postRepository.countByBoard(board);
        return BoardSummaryResponse.from(board, count);
    }
}