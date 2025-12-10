package org.zerock.backend.admin.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.admin.dto.board.AdminPostCreateRequest;
import org.zerock.backend.admin.dto.board.AdminPostResponse;
import org.zerock.backend.admin.dto.board.AdminPostUpdateRequest;
import org.zerock.backend.admin.service.AdminPostService;

@RestController
@RequestMapping("/api/admin/posts")
@RequiredArgsConstructor
public class AdminPostController {

    private final AdminPostService adminPostService;

    /**
     * [작성] 관리자 게시글 생성
     * POST /api/admin/posts
     */
    @PostMapping
    public ResponseEntity<Long> createPost(
            @Valid @RequestBody AdminPostCreateRequest request,
            HttpServletRequest httpRequest
    ) {
        // 1. 로그인한 관리자 ID 가져오기 (세션 필터가 넣어준 값)
        Long adminId = (Long) httpRequest.getAttribute("loginAdminId");
        
        // 2. 서비스 호출 (DTO에서 필드를 꺼내서 전달)
        Long postId = adminPostService.createAdminPost(
                request.getBoardId(),   // DTO의 boardId
                request.getTitle(),
                request.getContent(),
                adminId,                // 작성자(관리자) ID
                request.isImportant()   // 상단 고정 여부
        );

        return ResponseEntity.ok(postId);
    }

    /**
     * [삭제] 관리자 권한으로 게시글 삭제
     * DELETE /api/admin/posts/{postId}
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        // 관리자는 본인 글 뿐만 아니라 유저 글도 삭제 가능하므로 ID 체크 없이 호출
        adminPostService.deletePostByAdmin(postId);
        return ResponseEntity.noContent().build();
    }

    /**
     * [수정] 관리자 게시글 수정
     * PUT /api/admin/posts/{postId}
     */
    @PutMapping("/{postId}")
    public ResponseEntity<Void> updatePost(
            @PathVariable Long postId,
            @Valid @RequestBody AdminPostUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        Long adminId = (Long) httpRequest.getAttribute("loginAdminId");

        // 서비스에 수정 메서드가 필요합니다 (아래 설명 참조)
        adminPostService.updateAdminPost(postId, request, adminId);
        
        return ResponseEntity.ok().build();
    }

    /**
     * [상세 조회] 게시글 상세 내용 (수정 화면 등에서 사용)
     * GET /api/admin/posts/{postId}
     */
    @GetMapping("/{postId}")
    public ResponseEntity<AdminPostResponse> getPost(@PathVariable Long postId) {
        // 서비스에서 AdminPostResponse DTO로 변환해서 리턴해야 함
        AdminPostResponse response = adminPostService.getAdminPostDetail(postId);
        return ResponseEntity.ok(response);
    }
}