package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "booth_img_mapping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoothImage {

    @EmbeddedId
    private BoothImageId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("boothId")   // BoothImageId.boothId 사용
    @JoinColumn(name = "booth_id", nullable = false)
    private Booth booth;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("fileId")    // BoothImageId.fileId 사용
    @JoinColumn(name = "file_id", nullable = false)
    private MediaFile mediaFile;

}
