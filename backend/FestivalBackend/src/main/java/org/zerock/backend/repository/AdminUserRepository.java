package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.AdminApproveStatus;
import org.zerock.backend.entity.AdminUser;
import java.util.List;
import java.util.Optional;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    
    Optional<AdminUser> findByUsername(String username);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);

    // [중요] approveStatus와 requestedAt 필드가 AdminUser 엔티티에 있어야 동작함
    List<AdminUser> findByApproveStatusOrderByRequestedAtAsc(AdminApproveStatus approveStatus);

    // [추가] 계정 관리 목록 조회 시 권한 정보(Role)도 같이 가져오기 (N+1 문제 방지)
    @EntityGraph(attributePaths = {"role"})
    List<AdminUser> findAll();
}