package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * permission 테이블 매핑 엔티티.
 *
 * RBAC(Role-Based Access Control) 권한 시스템에서
 * "리소스 + 액션" 조합을 나타내는 개별 권한을 정의한다.
 *
 * 예시:
 *   - resource: "NOTICE"
 *   - action:   "WRITE"
 *   - permCode: "NOTICE_WRITE"
 *
 * perm_id는 AUTO_INCREMENT가 아니며,
 * 초기 권한 세트를 시스템 시작 시 직접 INSERT하여 관리한다.
 *
 * RolePermission 엔티티를 통해 Role과 다대다(N:N) 관계로 연결된다.
 */

@Entity
@Table(name = "permission")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Permission {
    /**
     * 권한 ID (PK)
     * AUTO_INCREMENT가 아니므로 수동으로 값 지정 필요.
     */
    @Id
    @Column(name = "perm_id")
    private Long permId; // AUTO_INCREMENT 아님

    /**
     * 권한이 적용되는 리소스 구분 (예: NOTICE, USER, ADMIN 등)
     */
    @Column(name = "resource", length = 50, nullable = false)
    private String resource;

    /**
     * 리소스에 대해 수행 가능한 행위 (예: READ, WRITE, DELETE 등)
     */
    @Column(name = "action", length = 50, nullable = false)
    private String action;

    /**
     * 권한 고유 코드 (resource + "_" + action 형태)
     * 예: NOTICE_WRITE
     */
    @Column(name = "perm_code", length = 120, nullable = false)
    private String permCode;
}