package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.AdminUser;

import java.util.Optional;
import java.util.List;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    // username 으로 관리자 한 명 조회 (로그인에 사용)
    Optional<AdminUser> findByUsername(String username);

    // email 로 조회 (중복 체크에 사용)
    boolean existsByEmail(String email);

    // username 중복 체크
    boolean existsByUsername(String username);

    // 활성/비활성 여부로 필터링
    List<AdminUser> findByIsActive(boolean active);

    // username + isActive 조합 조회 (로그인 시 비활성 사용자 차단용)
    Optional<AdminUser> findByUsernameAndIsActive(String username, boolean active);
}
