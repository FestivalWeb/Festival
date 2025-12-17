package org.zerock.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
@Embeddable
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoothImageId implements Serializable {

    @Column(name = "booth_id")
    private Long boothId;

    @Column(name = "file_id")
    private Long fileId;
}
