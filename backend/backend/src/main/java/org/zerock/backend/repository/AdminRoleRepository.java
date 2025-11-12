package org.zerock.backend.repository;

import org.zerock.backend.entity.AdminRole;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * AdminRole 엔티티를 위한 리포지토리
 *
 * JpaRepository<[엔티티 클래스], [엔티티의 ID 클래스 타입]>
 */
public interface AdminRoleRepository extends JpaRepository<AdminRole, AdminRole.AdminRoleId> {
}