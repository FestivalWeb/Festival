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
    @MapsId("postId")   // id.postId 값과 FK(post_id) 값 매핑
    @JoinColumn(name = "post_id", nullable = false)
    private post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("fileId")   // id.fileId 값과 FK(file_id) 값 매핑
    @JoinColumn(name = "file_id", nullable = false)
    private MediaFile file;

// 이전 코드는 단순히 pk로만 사용하여 fk 연관관계로 수정 
}
