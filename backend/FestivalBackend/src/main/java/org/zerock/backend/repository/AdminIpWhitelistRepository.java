package org.zerock.backend.repository;

import org.zerock.backend.entity.AdminIpWhitelist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminIpWhitelistRepository extends JpaRepository<AdminIpWhitelist, Long> {
}