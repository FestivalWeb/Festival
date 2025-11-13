package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "permission")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Permission {
    @Id
    @Column(name = "perm_id")
    private Long permId; // AUTO_INCREMENT 아님

    @Column(name = "resource", length = 50, nullable = false)
    private String resource;

    @Column(name = "action", length = 50, nullable = false)
    private String action;

    @Column(name = "perm_code", length = 120, nullable = false)
    private String permCode;
}