package org.zerock.backend.repository;

import org.zerock.backend.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    // 전체 목록 (id 기준 오름차순)
    List<Board> findAllByOrderByBoardIdAsc();

    // 활성 게시판만
    List<Board> findByStatusTrueOrderByBoardIdAsc();
}