package org.zerock.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

/**
 * NoticeImageMapping 엔티티의 복합키(notice_id + file_id)를 표현하는 클래스.
 *
 * notice_img_mapping 테이블은 PK로 notice_id와 file_id 두 컬럼을 함께 사용하므로,
 * JPA에서는 이를 하나의 키 객체로 묶어서 관리해야 한다.
 *
 * 이 클래스는 @Embeddable 로 표시되며,
 * NoticeImageMapping 엔티티에서 @EmbeddedId 로 사용된다.
 *
 * Serializable 구현은 JPA 복합키 규약(필수 요건)을 만족하기 위함이다.
 */

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeImageId implements Serializable {
    /**
     * notice_img_mapping.notice_id 컬럼과 매핑되는 값
     * (Notice 엔티티의 PK)
     */
    @Column(name = "notice_id")
    private Long noticeId;

    /**
     * notice_img_mapping.file_id 컬럼과 매핑되는 값
     * (MediaFile 엔티티의 PK)
     */
    @Column(name = "file_id")
    private Long fileId;
}
