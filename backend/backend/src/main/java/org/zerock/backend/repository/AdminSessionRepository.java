package org.zerock.backend.repository;

import org.zerock.backend.entity.AdminSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminSessionRepository extends JpaRepository<AdminSession, String> {
}