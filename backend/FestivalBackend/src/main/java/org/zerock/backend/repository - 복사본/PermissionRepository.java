package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
import org.springframework.data.jpa.repository.Query;
=======
>>>>>>> gnsdlxx-admin
import org.zerock.backend.entity.Permission;

import java.util.List;
import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Long> {

<<<<<<< HEAD
    // 1) resource로 권한 조회 (예: "notice", "admin", "gallery")
    List<Permission> findByResource(String resource);

    // 2) action으로 조회 (예: "read", "write", "delete")
    List<Permission> findByAction(String action);

    // 3) resource + action 조합으로 특정 Permission 조회
    Optional<Permission> findByResourceAndAction(String resource, String action);

    // 4) perm_code로 조회 (유일성 보장됨)
    Optional<Permission> findByPermCode(String permCode);

    // 5) 여러 perm_id 리스트로 조회
    List<Permission> findByPermIdIn(List<Long> permIds);

    // 6) 특정 resource에 해당하는 권한 코드 목록 조회
    @Query("select p.permCode from Permission p where p.resource = :resource")
    List<String> findPermCodesByResource(String resource);

    // 7) 특정 resource + action 조합 권한이 존재하는지 확인
=======
    // resource, action 권한 하나 조회
    Optional<Permission> findByResourceAndAction(String resource, String action);

    // 권한 코드 중복 체크
    boolean existsByPermCode(String permCode);

    // 특정 resource 에 속하는 권한 목록 조회
    List<Permission> findByResource(String resource);

    // 특정 action 만으로 조회
    List<Permission> findByAction(String action);

    // resource, action 조합 존재 여부 체크
>>>>>>> gnsdlxx-admin
    boolean existsByResourceAndAction(String resource, String action);
}
