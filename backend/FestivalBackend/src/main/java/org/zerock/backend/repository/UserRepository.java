package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.UserEntity;


public interface UserRepository extends JpaRepository<UserEntity, String> {
}
