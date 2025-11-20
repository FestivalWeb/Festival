package org.zerock.backend.repository;

import org.zerock.backend.entity.AdminIpWhitelist;
import org.zerock.backend.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminIpWhitelistRepository extends JpaRepository<AdminIpWhitelist, Long> {
    // 해당 관리자 계정에 대해 이 IP가 화이트리스트에 등록돼있는지 확인
    Optional<AdminIpWhitelist> findByAdminUserAndIpAddress(AdminUser adminUser, String ipAddress);

    // 존재 여부만 알고 싶을 때
    boolean existsByAdminUserAndIpAddress(AdminUser adminUser, String ipAddress);
}