package org.zerock.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.post;

public interface PostRepository extends JpaRepository<post, Long> {
    // [추가] 특정 게시판의 글 목록 조회 (페이징 포함)
    // findBy + Board(엔티티) + _ + BoardId(필드)
    Page<post> findByBoard_BoardId(Long boardId, Pageable pageable);
}