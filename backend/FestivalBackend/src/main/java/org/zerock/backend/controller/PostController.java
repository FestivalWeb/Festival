package org.zerock.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.zerock.backend.dto.PostCreateRequest;
import org.zerock.backend.dto.PostCreateResponse;
import org.zerock.backend.dto.PostDetailResponse;
import org.zerock.backend.dto.PostSummaryResponse;
import org.zerock.backend.dto.PostUpdateRequest;
import org.zerock.backend.service.PostService;


@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostCreateResponse> createPost(
            @RequestBody PostCreateRequest request,
            HttpSession session
    ) {
        // 1) 로그인한 회원 ID 가져오기
        String loginUserId = (String) session.getAttribute("LOGIN_USER_ID");
        if (loginUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        // 2) 서비스 호출
        PostCreateResponse response =
                postService.createPost(loginUserId, request);

        // 3) 201 Created + 생성된 게시글 ID 반환
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PostSummaryResponse>> getPostList() {
        List<PostSummaryResponse> list = postService.getPostList();
        return ResponseEntity.ok(list);
    }
    
    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailResponse> getPostDetail(@PathVariable Long postId) {
        PostDetailResponse response = postService.getPostDetail(postId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostDetailResponse> updatePost(
            @PathVariable Long postId,
            @RequestBody PostUpdateRequest request,
            HttpSession session
    ) {
        String loginUserId = (String) session.getAttribute("LOGIN_USER_ID");
        if (loginUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        try {
            PostDetailResponse response =
                    postService.updatePost(loginUserId, postId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) { // 작성자 아님
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long postId,
            HttpSession session
    ) {
        String loginUserId = (String) session.getAttribute("LOGIN_USER_ID");
        if (loginUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        try {
            postService.deletePost(loginUserId, postId);
            return ResponseEntity.noContent().build();  // 204 No Content
        } catch (IllegalStateException e) { // 작성자 아님
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }       

}
