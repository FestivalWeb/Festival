package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin_role")
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AdminRole {

    @EmbeddedId
    private AdminRoleId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("adminId")     // FK + PK 동기화
    @JoinColumn(name = "admin_id", nullable = false)
    private AdminUser adminUser;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("roleId")      // FK + PK 동기화
    @JoinColumn(name = "role_id", nullable = false)
    private RoleEntity role;

}   // pk로 설정되어 있어 fk 연관관계로 수정 - jsw2
