package org.zerock.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.backend.entity.post; // [수정] import 소문자 post

public interface PostRepository extends JpaRepository<post, Long> { // [수정] 제네릭 타입 post

    // 1. 제목 검색
    Page<post> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

    // 2. 내용 검색
    Page<post> findByContextContainingIgnoreCase(String keyword, Pageable pageable);

    // 3. 제목 + 내용 검색
    Page<post> findByTitleContainingIgnoreCaseOrContextContainingIgnoreCase(
            String keyword1, String keyword2, Pageable pageable
    );

    // 4. 작성자(User ID)로 검색
    Page<post> findByUser_UserIdContainingIgnoreCase(String keyword, Pageable pageable);

    // 5. 조회수 증가
    @Modifying
    @Query("UPDATE post p SET p.view = p.view + 1 WHERE p.postId = :postId") // [수정] 쿼리 내 엔티티 이름 post
    void increaseViewCount(@Param("postId") Long postId);
}