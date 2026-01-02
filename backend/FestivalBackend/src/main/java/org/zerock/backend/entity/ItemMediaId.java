package org.zerock.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
/**
 * ItemMedia 엔티티의 복합키(item_id + file_id)를 표현하는 클래스.
 *
 * item_media 테이블은 PK가 2개(ITEM_ID, FILE_ID)를 사용하므로,
 * JPA에서는 이를 하나의 키 객체로 묶어서 관리해야 한다.
 *
 * @Embeddable 은 해당 클래스가 엔티티의 PK 구성요소로 사용될 수 있음을 의미함.
 * @EmbeddedId 로 ItemMedia 엔티티에서 이 객체를 기본키로 사용한다.
 *
 * Serializable 구현은 JPA 복합키 규약(필수 요건)에 따라 반드시 필요함.
 */

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemMediaId implements Serializable {

    /**
     * item_media.item_id 컬럼과 매핑되는 값
     */
    @Column(name = "item_id")
    private Long itemId;

    /**
     * item_media.file_id 컬럼과 매핑되는 값
     */
    @Column(name = "file_id")
    private Long fileId;
}