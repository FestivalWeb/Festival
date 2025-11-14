package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "role_permission")
@Getter
@Setter
@NoArgsConstructor
public class RolePermissionEntity {

    @EmbeddedId
    private RolePermission id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("roleId") // 복합키 중 roleId 매핑
    @JoinColumn(name = "role_id")
    private RoleEntity role;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("permId") // 복합키 중 permId 매핑
    @JoinColumn(name = "perm_id")
    private PermissionEntity permission;
}
