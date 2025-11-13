package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.Permission;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
}