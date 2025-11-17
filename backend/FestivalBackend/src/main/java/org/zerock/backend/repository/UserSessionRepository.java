package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.UserSessionEntity;

public interface UserSessionRepository extends JpaRepository<UserSessionEntity, String> {
}
