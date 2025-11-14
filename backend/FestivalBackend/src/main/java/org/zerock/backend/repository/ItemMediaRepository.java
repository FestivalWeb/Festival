package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.zerock.backend.entity.ItemMedia;
import org.zerock.backend.entity.ItemMediaId;

import java.util.List;

public interface ItemMediaRepository extends JpaRepository<ItemMedia, ItemMediaId> {

    // 1) 'ItemId' -> 'Id'로 수정
    List<ItemMedia> findByItem_Id(Long itemId);

    // 2) (정상)
    List<ItemMedia> findByMediaFile_FileId(Long fileId);

    // 3) 'ItemId' -> 'Id'로 수정
    @Modifying
    void deleteByItem_Id(Long itemId);

    // 4) (정상)
    @Modifying
    void deleteByMediaFile_FileId(Long fileId);

    // 5) 'ItemId' -> 'Id'로 수정
    @Modifying
    void deleteByItem_IdAndMediaFile_FileId(Long itemId, Long fileId);

    // 6) 'ItemId' -> 'Id'로 수정 (방금 오류난 부분)
    long countByItem_Id(Long itemId);

    // 7) @Query 내부의 'item.itemId' -> 'item.id'로 수정
    @Query("select im from ItemMedia im join fetch im.mediaFile where im.item.id = :itemId")
    List<ItemMedia> findWithMediaFileByItemId(Long itemId);
}
