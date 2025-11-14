package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.SystemLogEntity;

public interface SystemLogRepository extends JpaRepository<SystemLogEntity, Long> {
}
