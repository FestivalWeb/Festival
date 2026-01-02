package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "role_permission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RolePermissionEntity {

    @EmbeddedId
    private RolePermissionId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("roleId")               // PK의 roleId 를 RoleEntity의 PK와 연결
    @JoinColumn(name = "role_id")
    private RoleEntity role;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("permId")               // PK의 permId 를 Permission의 PK와 연결
    @JoinColumn(name = "perm_id")
    private Permission permission;
}
