package org.zerock.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeImageId implements Serializable {

    @Column(name = "notice_id")
    private Long noticeId;

    @Column(name = "file_id")
    private Long fileId;
}
