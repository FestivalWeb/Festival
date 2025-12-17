package org.zerock.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.zerock.backend.dto.NoticeDto;
import org.zerock.backend.service.NoticeService;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    // 1. 목록 조회 (누구나)
    @GetMapping
    public ResponseEntity<Page<NoticeDto.Response>> getList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(noticeService.getNoticeList(page, size, keyword));
    }

    // 2. 상세 조회 (누구나)
    @GetMapping("/{id}")
    public ResponseEntity<NoticeDto.Response> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.getNoticeDetail(id));
    }

    // 3. 작성 (관리자 전용)
    @PostMapping
    public ResponseEntity<String> createNotice(
            @RequestBody NoticeDto.CreateRequest request,
            HttpSession session) {
        
        // 관리자 세션 체크
        String adminId = (String) session.getAttribute("LOGIN_ADMIN_ID");
        if (adminId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "관리자 로그인이 필요합니다.");
        }

        noticeService.createNotice(adminId, request);
        return ResponseEntity.ok("공지사항이 등록되었습니다.");
    }
}