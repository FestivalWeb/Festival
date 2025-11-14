package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.zerock.backend.entity.ItemMedia;
import org.zerock.backend.entity.ItemMediaId;

import java.util.List;

public interface ItemMediaRepository extends JpaRepository<ItemMedia, ItemMediaId> {

    // 1) 특정 갤러리 아이템에 연결된 매핑 전부 조회
    List<ItemMedia> findByItem_ItemId(Long itemId);

    // 2) 특정 파일이 어디에 쓰이는지(어떤 아이템들에 쓰이는지) 조회
    List<ItemMedia> findByMediaFile_FileId(Long fileId);

    // 3) 특정 아이템의 이미지 매핑 전부 삭제
    @Modifying
    void deleteByItem_ItemId(Long itemId);

    // 4) 특정 파일이 연결된 매핑 전부 삭제
    @Modifying
    void deleteByMediaFile_FileId(Long fileId);

    // 5) 특정 아이템에서 특정 파일 매핑만 삭제
    @Modifying
    void deleteByItem_ItemIdAndMediaFile_FileId(Long itemId, Long fileId);

    // 6) 아이템에 연결된 파일 개수
    long countByItem_ItemId(Long itemId);

    // 7) 특정 아이템과 관련된 모든 매핑 조회 (join fetch 예시)
    @Query("select im from ItemMedia im join fetch im.mediaFile where im.item.itemId = :itemId")
    List<ItemMedia> findWithMediaFileByItemId(Long itemId);
}
