package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.AdminUserSummaryResponse;
import org.zerock.backend.entity.AdminRole;
import org.zerock.backend.entity.AdminRoleId;
import org.zerock.backend.entity.AdminUser;
import org.zerock.backend.entity.RoleEntity;
import org.zerock.backend.repository.AdminIpWhitelistRepository;
import org.zerock.backend.repository.AdminRoleRepository;
import org.zerock.backend.repository.AdminSessionRepository;
import org.zerock.backend.repository.AdminUserRepository;
import org.zerock.backend.repository.RoleRepository;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminAccountService {

    private final AdminUserRepository adminUserRepository;
    private final RoleRepository roleRepository;
    private final AdminRoleRepository adminRoleRepository;
    private final AdminSessionRepository adminSessionRepository;
    private final AdminIpWhitelistRepository adminIpWhitelistRepository;

    // [헬퍼] 권한 체크 (null 안전)
    private boolean hasRole(AdminUser user, String roleCode) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) return false;
        return user.getRoles().stream()
                .anyMatch(ar -> roleCode.equals(ar.getRole().getRoleCode()));
    }

    /**
     * 관리자 목록 조회
     */
    @Transactional(readOnly = true)
    public List<AdminUserSummaryResponse> getAdminUserList() {
        List<AdminUser> users = adminUserRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return users.stream().map(this::toSummaryResponse).toList();
    }

    private AdminUserSummaryResponse toSummaryResponse(AdminUser user) {
        List<String> roleCodes = user.getRoles().stream()
                .map(AdminRole::getRole)
                .map(RoleEntity::getRoleCode)
                .collect(Collectors.toList());

        if (roleCodes.isEmpty()) roleCodes.add("NONE");

        String status = user.isActive() ? "ACTIVE" : "INACTIVE";

        return AdminUserSummaryResponse.builder()
                .adminId(user.getAdminId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .roles(roleCodes)
                .status(status)
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }

    /**
     * 관리자 권한 변경
     */
    @Transactional
    public void changeAdminRole(Long targetAdminId, String newRoleCode, HttpServletRequest request) {
        AdminUser loginAdmin = getLoginAdmin(request);

        // 1. SUPER 체크
        if (!hasRole(loginAdmin, "SUPER")) {
            throw new IllegalStateException("권한 변경은 SUPER 관리자만 가능합니다.");
        }

        AdminUser target = getTargetAdmin(targetAdminId);

        // 2. 자기 자신 변경 불가
        if (loginAdmin.getAdminId().equals(target.getAdminId())) {
            throw new IllegalStateException("자기 자신의 권한은 변경할 수 없습니다.");
        }

        // 3. 다른 SUPER 변경 불가 (권한 없는 경우 제외)
        if (hasRole(target, "SUPER")) {
            throw new IllegalStateException("다른 SUPER 관리자의 권한은 변경할 수 없습니다.");
        }

        RoleEntity newRole = roleRepository.findByRoleCode(newRoleCode)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 권한 코드: " + newRoleCode));

        // [핵심 수정] NonUniqueObjectException 해결 로직
        // 1) 이미 해당 권한을 가지고 있는지 체크 (중복 할당 방지)
        boolean alreadyHasRole = target.getRoles().stream()
                .anyMatch(ar -> ar.getRole().getRoleCode().equals(newRoleCode));
        
        if (alreadyHasRole) {
            // 이미 같은 권한이면 아무것도 안 하고 종료 (에러 아님)
            return;
        }

        // 2) 기존 권한 모두 제거 (컬렉션 조작 -> OrphanRemoval 동작)
        // 주의: repository.deleteBy...()와 컬렉션 clear()를 섞어 쓰면 충돌 발생함.
        // AdminUser 엔티티에 cascade = CascadeType.ALL, orphanRemoval = true 설정이 되어 있어야 함.
        target.getRoles().clear();

        // 3) DB 반영 (Flush) - 삭제 쿼리를 먼저 실행시켜 영속성 컨텍스트를 정리
        // 이렇게 해야 같은 ID로 다시 insert 할 때 충돌이 안 남
        adminUserRepository.flush(); 

        // 4) 새 권한 생성 및 추가 (컬렉션에 add만 하면 Cascade에 의해 자동 저장됨)
        AdminRole newAdminRole = AdminRole.builder()
                .id(new AdminRoleId(target.getAdminId(), newRole.getRoleId()))
                .adminUser(target)
                .role(newRole)
                .build();

        target.getRoles().add(newAdminRole);
        
        // save를 명시적으로 호출할 필요 없음 (Transactional + Cascade가 처리)
        // adminRoleRepository.save(newAdminRole); // <- 이거 때문에 에러 날 수 있음 (제거 권장)
    }

    /**
     * 관리자 상태 변경 (활성/비활성)
     */
    @Transactional
    public void changeAdminActiveStatus(Long targetAdminId, boolean active, HttpServletRequest request) {
        AdminUser loginAdmin = getLoginAdmin(request);
        AdminUser target = getTargetAdmin(targetAdminId);

        if (loginAdmin.getAdminId().equals(target.getAdminId())) {
            throw new IllegalStateException("자기 자신의 상태는 변경할 수 없습니다.");
        }

        boolean isTargetSuper = hasRole(target, "SUPER");
        boolean isTargetStaffOrNone = hasRole(target, "STAFF") || 
                                      (target.getRoles() == null || target.getRoles().isEmpty());

        boolean allowed = false;
        
        if (hasRole(loginAdmin, "SUPER")) {
            if (isTargetSuper) throw new IllegalStateException("다른 SUPER 관리자는 변경할 수 없습니다.");
            allowed = true; 
        } else if (hasRole(loginAdmin, "MANAGER")) {
            if (!isTargetStaffOrNone) {
                throw new IllegalStateException("MANAGER는 STAFF 이하만 관리할 수 있습니다.");
            }
            allowed = true;
        } else {
            throw new IllegalStateException("권한이 부족합니다.");
        }

        if (!allowed) throw new IllegalStateException("권한이 없어 상태를 변경할 수 없습니다.");

        target.setActive(active);
        target.setUpdatedAt(java.time.LocalDateTime.now());
        // adminUserRepository.save(target); // Transactional 안에서는 dirty checking으로 자동 저장됨
    }

    /**
     * 관리자 삭제
     */
    /**
     * 관리자 삭제 (Soft Delete 적용)
     * - DB에서 지우지 않고 isActive = false 로 변경하여 로그인 차단
     * - (선택 사항) 필요하다면 이름 뒤에 (탈퇴) 등을 붙여 구분할 수 있음
     */
    @Transactional
    public void deleteAdmin(Long targetAdminId, HttpServletRequest request) {
        AdminUser loginAdmin = getLoginAdmin(request);

        // 1. 권한 체크 (SUPER만 가능)
        if (!hasRole(loginAdmin, "SUPER")) {
            throw new IllegalStateException("계정 삭제(비활성)는 SUPER 관리자만 가능합니다.");
        }

        AdminUser target = getTargetAdmin(targetAdminId);

        // 2. 본인 삭제 불가
        if (loginAdmin.getAdminId().equals(target.getAdminId())) {
            throw new IllegalStateException("자기 자신은 삭제할 수 없습니다.");
        }

        // 3. 다른 SUPER 삭제 불가
        if (hasRole(target, "SUPER")) {
            throw new IllegalStateException("다른 SUPER 관리자는 삭제할 수 없습니다.");
        }

        // [핵심 변경] 물리 삭제(delete) 코드를 주석 처리하거나 제거하고, 상태 변경으로 대체
        
        // adminSessionRepository.deleteByAdminUser(target); // 세션은 지워도 됨 (선택)
        // adminIpWhitelistRepository.deleteByAdminUser(target); // 화이트리스트도 지워도 됨 (선택)
        
        // target.getRoles().clear(); // 권한을 유지하고 싶다면 이 줄 삭제 (나중에 복구 가능하게 하려면 유지)

        // 아예 DB에서 지우는 코드 삭제
        // adminUserRepository.delete(target); 
        
        // 대신 비활성화 처리 (Soft Delete)
        target.setActive(false);
        
        // (선택 사항) 목록에서 탈퇴한 사람임을 명확히 하려면 이름 변경
        // target.setName(target.getName() + " (탈퇴)"); 
    }

    // --- 내부 편의 메서드 ---
    private AdminUser getLoginAdmin(HttpServletRequest request) {
        Long id = (Long) request.getAttribute("loginAdminId");
        if (id == null) throw new IllegalStateException("로그인 정보가 없습니다.");
        return adminUserRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("로그인 관리자 정보가 없습니다."));
    }

    private AdminUser getTargetAdmin(Long id) {
        return adminUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("대상 관리자를 찾을 수 없습니다."));
    }
}