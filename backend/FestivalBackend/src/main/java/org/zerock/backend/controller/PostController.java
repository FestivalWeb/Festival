package org.zerock.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
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

    // ----------------- ① 글 작성 -----------------
    @PostMapping
    public ResponseEntity<PostCreateResponse> createPost(
            @RequestBody PostCreateRequest request,
            HttpSession session
    ) {
        String loginUserId = (String) session.getAttribute("LOGIN_USER_ID");
        if (loginUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        

        PostCreateResponse response = postService.createPost(loginUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ----------------- ② 글 목록 (페이징 + 검색/정렬) -----------------
    @GetMapping
    @SuppressWarnings("null")
    public ResponseEntity<Page<PostSummaryResponse>> getPostPage(
            @RequestParam(defaultValue = "0") int page,          // 0부터 시작
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "postId") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "ALL") String type      // ALL, TITLE, CONTENT, TITLE_CONTENT, USER
    ) {
        Sort.Direction dir = Sort.Direction.fromString(direction);
        Page<PostSummaryResponse> result =
                postService.getPostPage(page, size, sortBy, dir, keyword, type);

        return ResponseEntity.ok(result);
    }

    // (참고용: 옛날 전체 리스트가 필요하면 이런 식으로 다른 경로로 남겨둘 수도 있음)
    /*
    @GetMapping("/all")
    public ResponseEntity<List<PostSummaryResponse>> getPostList() {
        List<PostSummaryResponse> list = postService.getPostList();
        return ResponseEntity.ok(list);
    }
    */

    // ----------------- ③ 글 상세 -----------------
    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailResponse> getPostDetail(@PathVariable Long postId) {
        PostDetailResponse response = postService.getPostDetail(postId);
        return ResponseEntity.ok(response);
    }

    // ----------------- ④ 글 수정 -----------------
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

    // ----------------- ⑤ 글 삭제 -----------------
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
