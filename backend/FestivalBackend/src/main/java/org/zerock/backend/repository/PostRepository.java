package org.zerock.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.backend.entity.post;

public interface PostRepository extends JpaRepository<post, Long> {

    // 1. 제목 검색
    Page<post> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

    // 2. 내용 검색
    Page<post> findByContextContainingIgnoreCase(String keyword, Pageable pageable);

    // 3. 제목 + 내용 검색
    Page<post> findByTitleContainingIgnoreCaseOrContextContainingIgnoreCase(
            String keyword1, String keyword2, Pageable pageable
    );

    // 4. 작성자(User ID)로 검색
    // UserEntity 안의 userId 필드를 탐색 (User_UserId)
    Page<post> findByUser_UserIdContainingIgnoreCase(String keyword, Pageable pageable);

    // 5. 조회수 증가
    @Modifying
    @Query("UPDATE post p SET p.view = p.view + 1 WHERE p.postId = :postId")
    void increaseViewCount(@Param("postId") Long postId);

    void deleteByUser_UserId(String userId);
}