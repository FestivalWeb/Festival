package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notice_img_mapping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class NoticeImageMapping {
    @EmbeddedId
        private NoticeImageId id;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @MapsId("noticeId")  // NoticeImageId.noticeId랑 매핑
        @JoinColumn(name = "notice_id", nullable = false)
        private Notice notice;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @MapsId("fileId")    // NoticeImageId.fileId랑 매핑
        @JoinColumn(name = "file_id", nullable = false)
        private MediaFile mediaFile;    
}
