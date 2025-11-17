package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.backend.entity.GalleryItem;

import java.util.List;

public interface GalleryItemRepository extends JpaRepository<GalleryItem, Long> {
    
    // (찬주님이 만드신 코드)
    List<GalleryItem> findByAlbumIdOrderByCreatedAtDesc(Long albumId);

    /**
     * [추가] 앨범 상세 조회용 쿼리
     * N+1 방지를 위해 ItemMedia, MediaFile 까지 모두 JOIN FETCH 합니다.
     * (GalleryItem -> ItemMedia -> MediaFile)
     */
    @Query("SELECT DISTINCT gi FROM GalleryItem gi " +
           "LEFT JOIN FETCH gi.mediaMappings imm " +     // 1. ItemMedia 조인
           "LEFT JOIN FETCH imm.mediaFile mf " +      // 2. MediaFile 조인
           "WHERE gi.album.id = :albumId " +          // 3. 특정 앨범 ID
           "AND gi.status = true " +                  // 4. 활성화된 아이템만
           "ORDER BY gi.createdAt DESC") // (정렬 순서는 필요에 따라 수정)
    List<GalleryItem> findItemsByAlbumIdWithMedia(@Param("albumId") Long albumId);
}