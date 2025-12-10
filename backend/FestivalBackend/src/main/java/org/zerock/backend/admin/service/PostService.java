package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.board.PostResponse;
import org.zerock.backend.repository.PostRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;

    // 게시글 목록 조회
    public Page<PostResponse> getPostList(Long boardId, Pageable pageable) {
        // Repository에서 엔티티 가져와서 -> DTO로 변환
        return postRepository.findByBoard_BoardId(boardId, pageable)
                .map(PostResponse::from);
    }
}