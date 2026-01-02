package org.zerock.backend.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.admin.dto.AdminMemberDto;
import org.zerock.backend.admin.service.AdminMemberService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class AdminMemberController {

    private final AdminMemberService adminMemberService;

    /**
     * 회원 목록 조회
     * [GET] /api/admin/members
     */
    @GetMapping
    public ResponseEntity<List<AdminMemberDto.Summary>> getMembers() {
        return ResponseEntity.ok(adminMemberService.getMemberList());
    }

    /**
     * 회원 상태 변경 (정지/해제)
     * [PATCH] /api/admin/members/{userId}/status
     */
    @PatchMapping("/{userId}/status")
    public ResponseEntity<Void> changeStatus(
            @PathVariable String userId,
            @RequestBody AdminMemberDto.StatusRequest request
    ) {
        adminMemberService.changeMemberStatus(userId, request.isActive());
        return ResponseEntity.noContent().build();
    }

    /**
     * 회원 강제 삭제
     * [DELETE] /api/admin/members/{userId}
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteMember(@PathVariable String userId) {
        adminMemberService.forceDeleteMember(userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<String> changeMemberStatus(
        @PathVariable("userId") String userId,
        @RequestBody Map<String, Boolean> body) { // { "isActive": true } 또는 false
    
    boolean isActive = body.get("isActive");
    adminMemberService.changeMemberStatus(userId, isActive);
    
    return ResponseEntity.ok(isActive ? "회원 정지 해제 완료" : "회원 정지 처리 완료");
}
}