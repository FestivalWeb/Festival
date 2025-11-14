package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.AdminUser;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
}
