package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.board.BoardSummaryResponse; // DTO 재활용
import org.zerock.backend.entity.Board;
import org.zerock.backend.repository.BoardRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardUserService {

    private final BoardRepository boardRepository;

    // 1. 활성화된 게시판 목록 조회 (메뉴용)
    public List<BoardSummaryResponse> getActiveBoards() {
        // status가 true(사용 중)인 것만 가져와야 함
        // Repository에 findAllByStatusTrue() 같은 메서드가 필요하거나 스트림으로 필터링
        List<Board> boards = boardRepository.findAll(); 
        
        return boards.stream()
                .filter(Board::isStatus) // 활성 상태인 것만
                .map(BoardSummaryResponse::from)
                .collect(Collectors.toList());
    }

    // 2. 게시판 단건 조회 (제목 표시용)
    public BoardSummaryResponse getBoardInfo(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시판입니다."));
        
        if (!board.isStatus()) {
            throw new IllegalArgumentException("운영 중지된 게시판입니다.");
        }
        
        return BoardSummaryResponse.from(board);
    }
}