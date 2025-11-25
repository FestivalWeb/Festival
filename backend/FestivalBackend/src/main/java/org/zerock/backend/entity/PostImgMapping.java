package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@IdClass(PostImgMappingId.class) // [중요] 아까 만든 복합 키 클래스 연결
@Table(name = "post_img_mapping") // 테이블 이름 소문자
public class PostImgMapping {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private post post;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id")
    private MediaFile file;

    // 생성자
    @Builder
    public PostImgMapping(post post, MediaFile file) {
        this.post = post;
        this.file = file;
    }
}