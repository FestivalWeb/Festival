package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.RoleEntity;

public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
}
