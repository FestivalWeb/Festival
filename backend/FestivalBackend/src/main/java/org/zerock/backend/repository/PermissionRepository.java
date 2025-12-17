package org.zerock.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;


import org.zerock.backend.entity.Permission;

import java.util.List;
import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Long> {

    // resource, action 권한 하나 조회
    Optional<Permission> findByResourceAndAction(String resource, String action);

    // 권한 코드 중복 체크
    boolean existsByPermCode(String permCode);

    // 특정 resource 에 속하는 권한 목록 조회
    List<Permission> findByResource(String resource);

    // 특정 action 만으로 조회
    List<Permission> findByAction(String action);

    // resource, action 조합 존재 여부 체크
    boolean existsByResourceAndAction(String resource, String action);
}