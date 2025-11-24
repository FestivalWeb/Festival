package org.zerock.backend.repository;

import org.zerock.backend.entity.AdminRole;
import org.zerock.backend.entity.AdminRoleId;
import org.zerock.backend.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminRoleRepository extends JpaRepository<AdminRole, AdminRoleId> {
    List<AdminRole> findByAdminUser(AdminUser adminUser);

    void deleteByAdminUser(AdminUser adminUser);
}