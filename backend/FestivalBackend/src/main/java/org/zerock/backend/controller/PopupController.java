package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.dto.PopupDto;
import org.zerock.backend.service.PopupService;

import java.util.List;

@RestController
@RequestMapping("/api/popups")
@RequiredArgsConstructor
public class PopupController {

    private final PopupService popupService;

    // 활성 팝업 조회 (메인 페이지에서 호출)
    @GetMapping("/active")
    public ResponseEntity<List<PopupDto.Response>> getActivePopups() {
        return ResponseEntity.ok(popupService.getActivePopups());
    }

    // 팝업 등록 (관리자용)
    @PostMapping
    public ResponseEntity<String> create(@RequestBody PopupDto.CreateRequest request) {
        popupService.createPopup(request);
        return ResponseEntity.ok("팝업이 등록되었습니다.");
    }
}