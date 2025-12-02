package org.zerock.backend.repository;

import org.zerock.backend.entity.AdminRole;
import org.zerock.backend.entity.AdminRoleId;
import org.zerock.backend.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminRoleRepository extends JpaRepository<AdminRole, AdminRoleId> {
    List<AdminRole> findByAdminUser(AdminUser adminUser);

    void deleteByAdminUser(AdminUser adminUser);

    // 로그인한 adminId가 SUPER 권한을 가지고 있는지 여부
    boolean existsByAdminUser_AdminIdAndRole_RoleCode(Long adminId, String roleCode);
}