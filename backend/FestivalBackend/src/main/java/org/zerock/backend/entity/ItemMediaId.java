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
public class ItemMediaId implements Serializable {

    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "file_id")
    private Long fileId;
}