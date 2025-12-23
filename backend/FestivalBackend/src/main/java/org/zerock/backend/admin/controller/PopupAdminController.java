package org.zerock.backend.admin.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.admin.dto.popup.*;
import org.zerock.backend.admin.service.PopupAdminService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/popups")
@RequiredArgsConstructor
public class PopupAdminController {

    private final PopupAdminService popupAdminService;

    /** 팝업 목록 */
    @GetMapping
    public List<PopupSummaryResponse> getPopupList() {
        return popupAdminService.getPopupList();
    }

    /** 팝업 단건 조회 */
    @GetMapping("/{popupId}")
    public PopupSummaryResponse getPopup(@PathVariable Long popupId) {
        return popupAdminService.getPopup(popupId);
    }

    /** 신규 팝업 생성 */
    @PostMapping
    public PopupSummaryResponse createPopup(
            @Valid @RequestBody PopupCreateRequest request,
            HttpServletRequest httpRequest
    ) {
        return popupAdminService.createPopup(request, httpRequest);
    }

    /** 팝업 수정 (1건) */
    @PutMapping("/{popupId}")
    public PopupSummaryResponse updatePopup(
            @PathVariable Long popupId,
            @Valid @RequestBody PopupUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        return popupAdminService.updatePopup(popupId, request, httpRequest);
    }

    /** 팝업 다건 삭제 */
    @DeleteMapping("/bulk-delete")
    public void deletePopupsBulk(
            @RequestBody PopupBulkDeleteRequest request,
            HttpServletRequest httpRequest
    ) {
        popupAdminService.deletePopupsBulk(request, httpRequest);
    }

    /** 팝업 상태 일괄 변경 */
    @PatchMapping("/status")
    public void changePopupStatusBulk(
            @RequestBody PopupStatusBulkRequest request,
            HttpServletRequest httpRequest
    ) {
        popupAdminService.changePopupStatusBulk(request, httpRequest);
    }
}
