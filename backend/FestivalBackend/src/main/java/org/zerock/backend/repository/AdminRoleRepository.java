package org.zerock.backend.repository;

import org.zerock.backend.entity.AdminRole;
import org.springframework.data.jpa.repository.JpaRepository;

// 두 번째 제네릭 타입으로 엔티티 내부의 ID 클래스를 지정합니다.
public interface AdminRoleRepository extends JpaRepository<AdminRole, AdminRole.AdminRoleId> {
}