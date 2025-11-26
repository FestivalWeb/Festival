package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "permission")
@Getter
@Setter
@NoArgsConstructor
public class Permission {

    @Id
    @Column(name = "perm_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long permId;

    @Column(name = "resource", nullable = false, length = 50)
    private String resource;

    @Column(name = "action", nullable = false, length = 50)
    private String action;

    @Column(name = "perm_code", nullable = false, length = 120)
    private String permCode;
}
