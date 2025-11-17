package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "role")
@Getter
@Setter
@NoArgsConstructor
public class RoleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT 매핑
    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "role_code", nullable = false, length = 50)
    private String roleCode;

    @Column(name = "role_name", nullable = false, length = 80)
    private String roleName;
}
