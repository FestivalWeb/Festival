package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.RolePermissionEntity;
import org.zerock.backend.entity.RolePermissionId;


public interface RolePermissionRepository extends JpaRepository<RolePermissionEntity, RolePermissionId> {
}
