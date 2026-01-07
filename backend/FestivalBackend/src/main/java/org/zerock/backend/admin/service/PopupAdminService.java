package org.zerock.backend.admin.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.popup.*;
import org.zerock.backend.entity.AdminUser;
import org.zerock.backend.entity.MediaFile;
import org.zerock.backend.entity.Popup;
import org.zerock.backend.entity.PopupSchedule;
import org.zerock.backend.repository.AdminUserRepository;
import org.zerock.backend.repository.MediaFileRepository;
import org.zerock.backend.repository.PopUpRepository;
import org.zerock.backend.repository.PopupScheduleRepository;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PopupAdminService {

    private final PopUpRepository popUpRepository;
    private final PopupScheduleRepository popupScheduleRepository;
    private final AdminUserRepository adminUserRepository;
    private final AdminLogWriter adminLogWriter;
    private final MediaFileRepository mediaFileRepository;

    /** 로그인 관리자 조회 */
    private AdminUser getLoginAdmin(HttpServletRequest request) {
        Long loginAdminId = (Long) request.getAttribute("loginAdminId");
        if (loginAdminId == null) {
            throw new IllegalStateException("로그인한 관리자만 사용할 수 있는 기능입니다.");
        }

        return adminUserRepository.findById(loginAdminId)
                .orElseThrow(() -> new IllegalStateException("로그인 관리자 정보를 찾을 수 없습니다."));
    }

    /** roleCode 한 개 뽑기 */
    private String getRoleCode(AdminUser adminUser) {
        return adminUser.getRoles().stream()
                .map(ar -> ar.getRole().getRoleCode())
                .findFirst()
                .orElse(null);
    }

    /** 생성/수정 권한 체크: SUPER, MANAGER 허용 */
    private void assertCanWrite(AdminUser adminUser) {
        String role = getRoleCode(adminUser);
        if (role == null || !(role.equals("SUPER") || role.equals("MANAGER"))) {
            throw new IllegalStateException("팝업 생성/수정은 SUPER 또는 MANAGER만 가능합니다.");
        }
    }

    /** 삭제/일괄 처리 권한 체크: SUPER만 */
    private void assertSuper(AdminUser adminUser) {
        String role = getRoleCode(adminUser);
        if (!"SUPER".equals(role)) {
            throw new IllegalStateException("팝업 삭제/일괄 상태 변경은 SUPER 관리자만 가능합니다.");
        }
    }

    /** 목록 조회 */
    @Transactional(readOnly = true)
    public List<PopupSummaryResponse> getPopupList() {

        List<Popup> list = popUpRepository.findAllByOrderByPriorityAscPopupIdAsc();

        return list.stream()
                .map(PopupSummaryResponse::from)
                .collect(Collectors.toList());
    }

    /** 단건 조회 (수정 진입용) */
    @Transactional(readOnly = true)
    public PopupSummaryResponse getPopup(Long popupId) {

        Popup entity = popUpRepository.findById(popupId)
                .orElseThrow(() -> new IllegalArgumentException("팝업을 찾을 수 없습니다. id=" + popupId));

        return PopupSummaryResponse.from(entity);
    }

    /** 신규 팝업 생성 */
    @Transactional
    public PopupSummaryResponse createPopup(PopupCreateRequest request, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        assertCanWrite(loginAdmin);

        if (request.getStartAt().isAfter(request.getEndAt())) {
            throw new IllegalArgumentException("시작일은 종료일보다 빠르거나 같아야 합니다.");
        }

        // [수정] fileIds가 있으면 첫 번째 파일의 경로를 imageUri로 설정
        String imageUri = request.getImageUri(); // 기본값 (없으면 null)
        
        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            // 첫 번째 파일 ID로 MediaFile 조회
            MediaFile file = mediaFileRepository.findById(request.getFileIds().get(0))
                    .orElse(null);
            if (file != null) {
                imageUri = file.getStorageUri();
            }
        }

        Long priority = request.getPriority() != null ? request.getPriority() : 1L;
        // [수정] fileIds가 있으면 첫 번째 파일의 경로를 imageUri로 설정

        Popup pop = Popup.builder()
        .title(request.getTitle())
        .content(request.getContent())
        .imageUri(request.getImageUri())
        .priority(priority)
        .build();

        pop.setStatus(request.isStatus());

        // ✅ BaseEntity 쪽 필드 채워주기
        pop.setCreatedBy(loginAdmin.getAdminId());
        pop.setUpdatedBy(loginAdmin.getAdminId());

        Popup saved = popUpRepository.save(pop);

        // 스케줄 생성 (한 팝업당 1개의 메인 스케줄이라고 가정)
        PopupSchedule schedule = PopupSchedule.builder()
                .popUp(saved)
                .startAt(request.getStartAt())
                .endAt(request.getEndAt())
                .build();

        popupScheduleRepository.save(schedule);
        
        // ✅ 생성 로그
        adminLogWriter.logActivity(
            loginAdmin,
            "CREATE",
            "팝업 생성: " + saved.getTitle(),
            httpRequest.getRequestURI(),    // /api/admin/popups
            "POPUP",
            saved.getPopupId(),
            httpRequest
        );

        return PopupSummaryResponse.from(saved); // 생성 직후 json 응답에서 startAt, endAt이 null 값으로 받아와지나, 큰 문제는 없음. 

        
    }

    /** 팝업 수정 (1건씩) */
    @Transactional
    public PopupSummaryResponse updatePopup(Long popupId, PopupUpdateRequest request, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        assertCanWrite(loginAdmin);

        if (request.getStartAt().isAfter(request.getEndAt())) {
            throw new IllegalArgumentException("시작일은 종료일보다 빠르거나 같아야 합니다.");
        }

        Popup entity = popUpRepository.findById(popupId)
                .orElseThrow(() -> new IllegalArgumentException("팝업을 찾을 수 없습니다. id=" + popupId));

        Long priority = request.getPriority() != null ? request.getPriority() : 1L;

        entity.updateDetails(
                request.getTitle(),
                request.getContent(),
                request.getImageUri(),
                priority
        );
        entity.setStatus(request.isStatus());
        
        // 수정자 기록
        entity.setUpdatedBy(loginAdmin.getAdminId());

        // 기존 스케줄 중 하나 선택 (여기서는 startAt 젤 빠른 것 기준)
        PopupSchedule schedule = entity.getSchedules().stream()
        .min(Comparator.comparing(PopupSchedule::getStartAt))
        .orElse(null);

        if (schedule == null) {
            // 없으면 새로 만든다
            schedule = PopupSchedule.builder()
                    .popUp(entity)
                    .startAt(request.getStartAt())
                    .endAt(request.getEndAt())
                    .build();
            popupScheduleRepository.save(schedule);

            // 양방향이면 엔티티 쪽에도 추가 (선택)
            entity.getSchedules().add(schedule);

        } else {
            // ✅ 이미 영속 상태 엔티티 → 필드만 수정
            schedule.updatePeriod(request.getStartAt(), request.getEndAt());
            // @Transactional이라 별도 save() 필요 없음
        }

        // ✅ 수정 로그
        adminLogWriter.logActivity(
            loginAdmin,
            "UPDATE",
            "팝업 수정: " + entity.getTitle(),
            httpRequest.getRequestURI(),           // /api/admin/popups/{id}
            "POPUP",
            entity.getPopupId(),
            httpRequest
        );
        return PopupSummaryResponse.from(entity);
    }

    /** 팝업 다건 삭제 */
    @Transactional
    public void deletePopupsBulk(PopupBulkDeleteRequest request, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        assertSuper(loginAdmin);

        if (request.getPopupIds() == null || request.getPopupIds().isEmpty()) {
            return;
        }

       // 1) 먼저 해당 팝업 엔티티들을 전부 로딩
        List<Popup> popups = popUpRepository.findAllById(request.getPopupIds());

        // 2) 일반 deleteAll 사용 → 엔티티 단위 삭제라 cascade/orphanRemoval 적용됨
        popUpRepository.deleteAll(popups);

        adminLogWriter.logActivity(
                loginAdmin,
                "DELETE",
                "팝업 다건 삭제 (개수: " + popups.size() + ")",
                httpRequest.getRequestURI(), // 예: /api/admin/popups/bulk-delete
                "POPUP",
                null,                        // 여러 개라 특정 id 없으면 null
                httpRequest
        );
        }

    /** 상태 일괄 변경 (여러 건) */
    @Transactional
    public void changePopupStatusBulk(PopupStatusBulkRequest request, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        assertSuper(loginAdmin);

        if (request.getPopupIds() == null || request.getPopupIds().isEmpty()) {
            return;
        }

        List<Popup> list = popUpRepository.findAllById(request.getPopupIds());

        for (Popup p : list) {
            p.setStatus(request.isStatus());
        }
    }
}
