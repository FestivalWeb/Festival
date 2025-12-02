package org.zerock.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.post;

public interface PostRepository extends JpaRepository<post, Long> {

    // 제목 검색
    Page<post> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

    // 내용 검색
    Page<post> findByContextContainingIgnoreCase(String keyword, Pageable pageable);

    // 제목 + 내용 검색
    Page<post> findByTitleContainingIgnoreCaseOrContextContainingIgnoreCase(
            String keyword1, String keyword2, Pageable pageable
    );

    // 작성자 검색
    Page<post> findByUserIdContainingIgnoreCase(String keyword, Pageable pageable);
}