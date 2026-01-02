package org.zerock.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.zerock.backend.dto.NoticeDto;
import org.zerock.backend.service.NoticeService;

@RestController
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    // ==========================================
    //  [공개] 누구나 조회 가능 (/api/notices)
    // ==========================================

    // 1. 목록 조회
    @GetMapping("/api/notices")
    public ResponseEntity<Page<NoticeDto.Response>> getList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(noticeService.getNoticeList(page, size, keyword));
    }

    // 2. 상세 조회
    @GetMapping("/api/notices/{id}")
    public ResponseEntity<NoticeDto.Response> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.getNoticeDetail(id));
    }

    // ==========================================
    //  [관리자] 작성/수정/삭제 (/api/admin/notices)
    //  * AdminSessionFilter가 이 경로를 인터셉트하여 인증 처리함
    // ==========================================

    // 3. 작성
    @PostMapping("/api/admin/notices")
    public ResponseEntity<String> createNotice(
            @RequestBody NoticeDto.CreateRequest request,
            HttpServletRequest httpRequest) {
        
        Long adminId = getAdminIdFromRequest(httpRequest);
        noticeService.createNotice(String.valueOf(adminId), request);
        
        return ResponseEntity.ok("공지사항이 등록되었습니다.");
    }

    // 4. 수정
    @PutMapping("/api/admin/notices/{id}")
    public ResponseEntity<String> updateNotice(
            @PathVariable Long id,
            @RequestBody NoticeDto.CreateRequest request,
            HttpServletRequest httpRequest) {
        
        getAdminIdFromRequest(httpRequest); // 권한 체크
        noticeService.updateNotice(id, request);
        
        return ResponseEntity.ok("공지사항이 수정되었습니다.");
    }

    // 5. 삭제
    @DeleteMapping("/api/admin/notices/{id}")
    public ResponseEntity<String> deleteNotice(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        
        getAdminIdFromRequest(httpRequest); // 권한 체크
        noticeService.deleteNotice(id);
        
        return ResponseEntity.ok("공지사항이 삭제되었습니다.");
    }

    // [내부 메서드] 필터가 검증한 adminId 가져오기
    private Long getAdminIdFromRequest(HttpServletRequest request) {
        Object adminIdObj = request.getAttribute("loginAdminId");
        if (adminIdObj == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "관리자 권한이 필요합니다.");
        }
        return (Long) adminIdObj;
    }
}