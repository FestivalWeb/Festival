package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * notice_img_mapping 테이블 매핑 엔티티.
 *
 * Notice(공지사항) ↔ MediaFile(파일) 간의 다대다(N:N) 관계를
 * 조인 엔티티 형태(1:N - N:1)로 풀어낸 구조.
 *
 * 즉, 한 Notice가 여러 MediaFile을 가질 수 있고,
 * 한 MediaFile도 여러 Notice에 포함될 수 있는 구조를 표현한다.
 *
 * PK는 notice_id + file_id의 복합키이며,
 * NoticeImageId(Embeddable)로 관리한다.
 */

@Entity
@Table(name = "notice_img_mapping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class NoticeImageMapping {
    /**
     * 복합 기본키 (notice_id + file_id)
     * NoticeImageId는 @Embeddable 로 정의된 복합키 클래스.
     */
    @EmbeddedId
        private NoticeImageId id;

        /**
         * Notice 엔티티와의 N:1 관계
         * notice_img_mapping.notice_id → Notice.notice_id
         *
         * @MapsId("noticeId") :
         *   - 복합키 NoticeImageId.noticeId 필드를 이 FK 값과 동기화함
         *   - 즉, NoticeImageId 안의 noticeId = this.notice.noticeId
         */
        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @MapsId("noticeId")  // NoticeImageId.noticeId랑 매핑
        @JoinColumn(name = "notice_id", nullable = false)
        private Notice notice;

        /**
         * MediaFile 엔티티와의 N:1 관계
         * notice_img_mapping.file_id → media_file.file_id
         *
         * @MapsId("fileId") :
         *   - 복합키 NoticeImageId.fileId 필드를 이 FK 값과 동기화함
         */
        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @MapsId("fileId")    // NoticeImageId.fileId랑 매핑
        @JoinColumn(name = "file_id", nullable = false)
        private MediaFile mediaFile;    
}
