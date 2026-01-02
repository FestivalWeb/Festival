package org.zerock.backend.entity;

import lombok.*;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import java.io.Serializable;

@Embeddable
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode // [핵심] 이게 없어서 저장이 안 된 겁니다!
public class PostImgMappingId implements Serializable {

    @Column(name = "post_id")
    private Long postId;

    @Column(name = "file_id")
    private Long fileId;
}