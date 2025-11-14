package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.AdminActivityLog;

public interface AdminActivityLogRepository extends JpaRepository<AdminActivityLog, Long> {
}
