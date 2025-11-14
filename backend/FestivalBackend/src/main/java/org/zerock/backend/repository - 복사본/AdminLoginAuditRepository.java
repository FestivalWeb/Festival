package org.zerock.backend.repository;

import org.zerock.backend.entity.AdminLoginAudit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminLoginAuditRepository extends JpaRepository<AdminLoginAudit, Long> {
}