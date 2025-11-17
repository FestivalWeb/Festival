package org.zerock.backend.repository;

import org.zerock.backend.entity.AdminRole;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AdminRoleRepository extends JpaRepository<AdminRole, AdminRole.AdminRoleId> {
}