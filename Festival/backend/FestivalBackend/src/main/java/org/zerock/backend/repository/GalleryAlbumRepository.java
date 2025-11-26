package org.zerock.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.backend.entity.GalleryAlbum;
import org.zerock.backend.entity.Visibility;

import java.util.List;

public interface GalleryAlbumRepository extends JpaRepository<GalleryAlbum, Long> {
    
    // (찬주님이 만드신 코드)
    List<GalleryAlbum> findByVisibilityAndActiveIsTrue(Visibility visibility);

    /**
     * [추가] 앨범 목록 조회 (카테고리 코드 + 검색어 + 페이지네이션)
     * N+1 방지를 위해 coverFile과 category를 JOIN FETCH 합니다.
     */
    @Query(
        value = "SELECT ga FROM GalleryAlbum ga " +
                "JOIN FETCH ga.category gc " +       // 카테고리 정보
                "LEFT JOIN FETCH ga.coverFile cf " + // 썸네일(coverFile) 정보
                "WHERE gc.code = :categoryCode " +   // 1. 카테고리 코드로 필터
                "AND ga.active = true " +            // 2. 활성화된 앨범
                "AND ga.visibility = 'PUBLIC' " +    // 3. 공개된 앨범
                "AND (:keyword IS NULL OR ga.title LIKE %:keyword%)", // 4. (동적) 제목 검색

        // 페이지네이션을 위한 카운트 쿼리 (JOIN FETCH 제외)
        countQuery = "SELECT COUNT(ga) FROM GalleryAlbum ga " +
                     "JOIN ga.category gc " +
                     "WHERE gc.code = :categoryCode " +
                     "AND ga.active = true " +
                     "AND ga.visibility = 'PUBLIC' " +
                     "AND (:keyword IS NULL OR ga.title LIKE %:keyword%)"
    )
    Page<GalleryAlbum> findAlbumsByCategoryAndKeyword(
            @Param("categoryCode") String categoryCode,
            @Param("keyword") String keyword,
            Pageable pageable);
}