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


    /**
     * 관리자 계정 전체 목록 조회
     */
    public List<AdminUserSummaryResponse> getAdminUserList() {

        // createdAt 기준으로 최신 순 정렬 (원하면 username 기준 등으로 바꿔도 됨)
        List<AdminUser> users = adminUserRepository
                .findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return users.stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    private AdminUserSummaryResponse toSummaryResponse(AdminUser user) {

        // 이 관리자가 가진 role_code 목록 뽑기
        List<String> roleCodes = user.getRoles().stream()
                .map(AdminRole::getRole)              // AdminRole → RoleEntity
                .map(role -> role.getRoleCode())      // RoleEntity → roleCode
                .collect(Collectors.toList());

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
     * 관리자 권한 변경 (SUPER만 가능)
     */
    @Transactional
    @SuppressWarnings("null")
    public void changeAdminRole(Long targetAdminId, String newRoleCode, HttpServletRequest request) {

        // 1. 필터에서 심어준 loginAdminId 꺼내기
    Long loginAdminId = (Long) request.getAttribute("loginAdminId");
    if (loginAdminId == null) {
        throw new IllegalStateException("로그인한 관리자만 권한을 변경할 수 있습니다.");
    }

    // 2. 현재 로그인 관리자 (영속 상태)
    AdminUser loginAdmin = adminUserRepository.findById(loginAdminId)
            .orElseThrow(() -> new IllegalStateException("로그인 관리자 정보를 찾을 수 없습니다."));

    // 3. SUPER 권한인지 확인
    boolean isSuper = loginAdmin.getRoles().stream()
            .map(ar -> ar.getRole().getRoleCode())
            .anyMatch("SUPER"::equals);
    if (!isSuper) {
        throw new IllegalStateException("권한 변경은 SUPER 관리자만 가능합니다.");
    }

    // 4. 요청된 새 권한 유효성 체크
    if (!( "SUPER".equals(newRoleCode) ||
           "MANAGER".equals(newRoleCode) ||
           "STAFF".equals(newRoleCode))) {
        throw new IllegalArgumentException("관리자 권한은 SUPER, MANAGER, STAFF만 설정할 수 있습니다.");
    }

    // 5. 대상 관리자 조회
    AdminUser target = adminUserRepository.findById(targetAdminId)
            .orElseThrow(() -> new IllegalArgumentException("대상 관리자를 찾을 수 없습니다."));

    if (loginAdmin.getAdminId().equals(target.getAdminId())) {
        throw new IllegalStateException("자기 자신의 권한은 이 API로 변경할 수 없습니다.");
    }

    // 6. 현재 권한 코드 계산 (User 쪽 컬렉션에서만)
    String currentRoleCode = target.getRoles().stream()
            .map(ar -> ar.getRole().getRoleCode())
            .findFirst()
            .orElse(null);

    if ("SUPER".equals(currentRoleCode)) {
        throw new IllegalStateException("다른 SUPER 관리자의 권한은 변경할 수 없습니다.");
    }

    // 이미 같은 권한이면 할 일 없음
    if (newRoleCode.equals(currentRoleCode)) {
        return;
    }

    // 7. 새 RoleEntity 조회
    RoleEntity newRole = roleRepository.findByRoleCode(newRoleCode)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 권한 코드입니다: " + newRoleCode));

    // 8. 기존 역할 매핑 제거
    //    → AdminUser.roles 컬렉션만 조작하면 orphanRemoval 때문에 join row 삭제됨
    target.getRoles().clear();

    // 9. 새 AdminRole 생성해서 User 쪽 컬렉션에만 추가
    AdminRole newAdminRole = AdminRole.builder()
            .id(new AdminRoleId(target.getAdminId(), newRole.getRoleId()))
            .adminUser(target)
            .role(newRole)
            .build();

    target.getRoles().add(newAdminRole);
    }

    @Transactional
    @SuppressWarnings("null")
    public void changeAdminActiveStatus(Long targetAdminId, boolean active, HttpServletRequest request) {

        // 1. 로그인 관리자 확인
        Long loginAdminId = (Long) request.getAttribute("loginAdminId");
        if (loginAdminId == null) {
            throw new IllegalStateException("로그인한 관리자만 상태를 변경할 수 있습니다.");
        }

        AdminUser loginAdmin = adminUserRepository.findById(loginAdminId)
                .orElseThrow(() -> new IllegalStateException("로그인 관리자 정보를 찾을 수 없습니다."));

        // 2. 로그인 관리자의 권한(역할) 확인
        String loginRoleCode = loginAdmin.getRoles().stream()
                .map(ar -> ar.getRole().getRoleCode())
                .findFirst()
                .orElse(null);

        if (loginRoleCode == null) {
            throw new IllegalStateException("로그인 관리자에게 권한(Role)이 설정되어 있지 않습니다.");
        }

        // 3. 대상 관리자 조회
        AdminUser target = adminUserRepository.findById(targetAdminId)
                .orElseThrow(() -> new IllegalArgumentException("대상 관리자를 찾을 수 없습니다."));

        // 자기 자신의 active는 막아두는 게 안전
        if (loginAdmin.getAdminId().equals(target.getAdminId())) {
            throw new IllegalStateException("자기 자신의 활성/비활성 상태는 이 API로 변경할 수 없습니다.");
        }

        // 4. 대상 관리자의 권한 확인
        String targetRoleCode = target.getRoles().stream()
                .map(ar -> ar.getRole().getRoleCode())
                .findFirst()
                .orElse(null);

        if (targetRoleCode == null) {
            throw new IllegalStateException("대상 관리자에게 권한(Role)이 설정되어 있지 않습니다.");
        }

        // 5. 권한에 따른 제어 규칙
        // SUPER: MANAGER, STAFF 조작 가능 (다른 SUPER는 불가)
        // MANAGER: STAFF만 조작 가능
        // STAFF: 아무도 조작 불가
        boolean allowed = false;

        switch (loginRoleCode) {
            case "SUPER" -> {
                if ("SUPER".equals(targetRoleCode)) {
                    throw new IllegalStateException("다른 SUPER 관리자의 상태는 변경할 수 없습니다.");
                }
                // PUBLIC / MEMBER도 여기서 조작하고 싶으면 추가로 허용해도 됨
                allowed = "MANAGER".equals(targetRoleCode) || "STAFF".equals(targetRoleCode);
            }
            case "MANAGER" -> {
                if (!"STAFF".equals(targetRoleCode)) {
                    throw new IllegalStateException("MANAGER는 STAFF 계정만 활성/비활성할 수 있습니다.");
                }
                allowed = true;
            }
            default -> {
                throw new IllegalStateException("해당 권한에서는 다른 관리자의 상태를 변경할 수 없습니다.");
            }
        }

        if (!allowed) {
            throw new IllegalStateException("권한이 없어 상태를 변경할 수 없습니다.");
        }

        // 6. 실제 활성/비활성 변경
        target.setActive(active);
        target.setUpdatedAt(java.time.LocalDateTime.now());

        // @Transactional 이라 save 없어도 되지만, 명시하고 싶으면:
        adminUserRepository.save(target);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteAdmin(Long targetAdminId, HttpServletRequest request) {

        // 1. 로그인한 관리자 ID 가져오기 (필터에서 넣어준 값)
        Long loginAdminId = (Long) request.getAttribute("loginAdminId");
        if (loginAdminId == null) {
            throw new IllegalStateException("로그인한 관리자만 계정을 삭제할 수 있습니다.");
        }

        // 2. 로그인 관리자 조회
        AdminUser loginAdmin = adminUserRepository.findById(loginAdminId)
                .orElseThrow(() -> new IllegalStateException("로그인 관리자 정보를 찾을 수 없습니다."));

        String loginRoleCode = loginAdmin.getRoles().stream()
                .map(ar -> ar.getRole().getRoleCode())
                .findFirst()
                .orElse(null);

        if (!"SUPER".equals(loginRoleCode)) {
            throw new IllegalStateException("계정 삭제는 SUPER 관리자만 가능합니다.");
        }

        // 3. 대상 관리자 조회
        AdminUser target = adminUserRepository.findById(targetAdminId)
                .orElseThrow(() -> new IllegalArgumentException("대상 관리자를 찾을 수 없습니다."));

        // 자기 자신은 삭제 금지
        if (loginAdmin.getAdminId().equals(target.getAdminId())) {
            throw new IllegalStateException("자기 자신의 계정은 삭제할 수 없습니다.");
        }

        // 대상 권한 확인
        String targetRoleCode = target.getRoles().stream()
                .map(ar -> ar.getRole().getRoleCode())
                .findFirst()
                .orElse(null);

        if ("SUPER".equals(targetRoleCode)) {
            throw new IllegalStateException("다른 SUPER 관리자의 계정은 삭제할 수 없습니다.");
        }

        // 4. 관련 데이터 정리
        // 세션 삭제
        adminSessionRepository.deleteByAdminUser(target);

        // IP 화이트리스트 삭제
        adminIpWhitelistRepository.deleteByAdminUser(target);

        // 역할 매핑 삭제
        adminRoleRepository.deleteByAdminUser(target);

        // (AdminActivityLog 는 AdminUser 쪽에 cascade = ALL 이라면 같이 지워질 것)

        // 5. 최종적으로 관리자 계정 삭제
        adminUserRepository.delete(target);
    }
}
