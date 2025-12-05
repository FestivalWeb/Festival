package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.AdminUser;

import java.util.Optional;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    // 로그인 시 사용할 메서드
    Optional<AdminUser> findByUsername(String username);

    // 관리자 계정 생성 시 중복 체크 등에 쓸 수 있음 (선택)
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
