package org.zerock.backend.repository;

import org.zerock.backend.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    // ID 기준 오름차순 정렬 조회
    List<Board> findAllByOrderByBoardIdAsc();
}