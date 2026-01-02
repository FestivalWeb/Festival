package org.zerock.backend.repository;

import org.zerock.backend.entity.AdminRole;
import org.zerock.backend.entity.AdminRoleId;
import org.zerock.backend.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdminRoleRepository extends JpaRepository<AdminRole, AdminRoleId> {
    List<AdminRole> findByAdminUser(AdminUser adminUser);
    void deleteByAdminUser(AdminUser adminUser);

    // [수정] 긴 이름 대신 @Query 사용
    @Query("SELECT COUNT(ar) > 0 FROM AdminRole ar WHERE ar.adminUser.adminId = :adminId AND ar.role.roleCode = :roleCode")
    boolean existsByAdminUser_AdminIdAndRole_RoleCode(@Param("adminId") Long adminId, @Param("roleCode") String roleCode);

}