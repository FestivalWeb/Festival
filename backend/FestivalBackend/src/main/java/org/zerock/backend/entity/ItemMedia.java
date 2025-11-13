package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "item_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemMedia {

    @EmbeddedId
    private ItemMediaId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("itemId")   // ItemMediaId.itemId
    @JoinColumn(name = "item_id", nullable = false)
    private GalleryItem item; // gallery_item 테이블 엔티티에서 가져와야 함, gallery_item 엔티티에서 @ManyToMany 제거 후 수정 필요함

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("fileId")   // ItemMediaId.fileId
    @JoinColumn(name = "file_id", nullable = false)
    private MediaFile mediaFile;
}
