package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.AdminApproveStatus;
import org.zerock.backend.entity.AdminUser;
import java.util.List;
import java.util.Optional;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    
    Optional<AdminUser> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // [추가] 승인 대기 목록 조회용
    List<AdminUser> findByApproveStatusOrderByRequestedAtAsc(AdminApproveStatus approveStatus);
}