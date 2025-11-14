package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // @Query 임포트
import org.zerock.backend.entity.Permission;

import java.util.List;
import java.util.Optional;

/**
 * Permission 엔티티를 위한 리포지토리 (Merge Conflict 해결)
 */
public interface PermissionRepository extends JpaRepository<Permission, Long> {

    // --- (양쪽 브랜치에 공통으로 존재하던 메소드들) ---

    /**
     * resource + action 조합으로 특정 Permission 조회
     */
    Optional<Permission> findByResourceAndAction(String resource, String action);

    /**
     * 특정 resource 에 속하는 권한 목록 조회
     */
    List<Permission> findByResource(String resource);

    /**
     * 특정 action 만으로 조회
     */
    List<Permission> findByAction(String action);

    /**
     * resource, action 조합 존재 여부 체크
     */
    boolean existsByResourceAndAction(String resource, String action);

    // --- (gnsdlxx-admin 브랜치(main)에만 있던 메소드) ---

    /**
     * 권한 코드 중복 체크
     */
    boolean existsByPermCode(String permCode);

    // --- (HEAD 브랜치(potibeo)에만 있던 메소드들) ---

    /**
     * perm_code로 조회 (유일성 보장됨)
     */
    Optional<Permission> findByPermCode(String permCode);

    /**
     * 여러 perm_id 리스트로 조회
     */
    List<Permission> findByPermIdIn(List<Long> permIds);

    /**
     * 특정 resource에 해당하는 권한 코드 목록 조회
     */
    @Query("select p.permCode from Permission p where p.resource = :resource")
    List<String> findPermCodesByResource(String resource);

}