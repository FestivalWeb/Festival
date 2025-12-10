package org.zerock.backend.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.admin.dto.board.PostResponse;
import org.zerock.backend.admin.service.PostService;

@RestController
@RequestMapping("/api/posts") // ★ 프론트엔드가 호출하는 주소
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public Page<PostResponse> getPostList(
            @RequestParam Long boardId, // ?boardId=1
            @PageableDefault(size = 10, sort = "postId", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return postService.getPostList(boardId, pageable);
    }
}