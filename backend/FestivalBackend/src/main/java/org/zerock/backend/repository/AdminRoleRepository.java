package org.zerock.backend.repository;

import org.zerock.backend.entity.AdminRole;
import org.zerock.backend.entity.AdminRoleId;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AdminRoleRepository extends JpaRepository<AdminRole, AdminRoleId> {
}