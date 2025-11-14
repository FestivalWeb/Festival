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

    @Id // 복합 키의 일부임을 표시
    @Column(name = "post_id")
    private Long postId;

    @Id // 복합 키의 일부임을 표시
    @Column(name = "file_id")
    private Long fileId;

    // 생성자
    @Builder
    public PostImgMapping(Long postId, Long fileId) {
        this.postId = postId;
        this.fileId = fileId;
    }
}