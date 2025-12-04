package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "post_img_mapping")
public class PostImgMapping {

    @EmbeddedId
    private PostImgMappingId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("post")
    @JoinColumn(name = "post_id", nullable = false)
    private post post; // [수정] 타입 변경: Post -> post

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("file")
    @JoinColumn(name = "file_id", nullable = false)
    private MediaFile file;
}