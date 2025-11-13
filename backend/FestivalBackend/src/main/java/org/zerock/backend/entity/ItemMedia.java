package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;
/*
 * item_media 테이블 매핑 엔티티
 *
 * GalleryItem ↔ MediaFile 간의 다대다(N:N) 관계를
 * 조인 엔티티 형태(1:N - N:1)로 풀어서 저장하는 구조.
 *
 * 복합키(item_id + file_id)는 ItemMediaId로 관리하며
 * 정렬, 대표 이미지 여부 등 메타데이터가 추가될 때 유연하게 확장 가능함.
 */
@Entity
@Table(name = "item_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemMedia {
    /**
     * 복합 기본키 (item_id + file_id)
     * @EmbeddedId는 JPA에서 복합키를 하나의 객체로 관리하기 위한 규칙임.
     */
    @EmbeddedId
    private ItemMediaId id;

    /**
     * GalleryItem 과의 다대일 관계 (item_media.item_id → gallery_item.item_id)
     * @MapsId("itemId")는 복합키(ItemMediaId)의 itemId 필드를
     * 이 엔티티의 FK 값과 동기화시키기 위한 설정.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("itemId")   // ItemMediaId.itemId
    @JoinColumn(name = "item_id", nullable = false)
    private GalleryItem item; // gallery_item 테이블 엔티티에서 가져와야 함, gallery_item 엔티티에서 @ManyToMany 제거 후 수정 필요함

    /**
     * MediaFile 과의 다대일 관계 (item_media.file_id → media_file.file_id)
     * @MapsId("fileId")는 복합키(ItemMediaId)의 fileId와 매핑됨.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("fileId")   // ItemMediaId.fileId
    @JoinColumn(name = "file_id", nullable = false)
    private MediaFile mediaFile;
}
