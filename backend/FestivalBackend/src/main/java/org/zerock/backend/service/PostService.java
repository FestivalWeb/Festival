package org.zerock.backend.service;

import org.zerock.backend.dto.PostCreateRequest;
import org.zerock.backend.dto.PostCreateResponse;
import org.zerock.backend.dto.PostDetailResponse;
import org.zerock.backend.dto.PostSummaryResponse;
import org.zerock.backend.dto.PostUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface PostService {

    /**
     * 로그인한 회원이 게시글 작성
     *
     * @param loginUserId   세션 or Security 에서 꺼낸 user_id
     * @param request       제목/내용/파일ID 목록
     */
    PostCreateResponse createPost(String loginUserId, PostCreateRequest request);

    // 게시글 목록 조회 (간단하게 전체, 최신순)
    List<PostSummaryResponse> getPostList();
    
    // 게시글 상세 조회 (조회수 +1 포함)
    PostDetailResponse getPostDetail(Long postId);

    // 글 수정 (작성자만 가능)
    PostDetailResponse updatePost(String loginUserId, Long postId, PostUpdateRequest request);

    // 글 삭제 (작성자만 가능)
    void deletePost(String loginUserId, Long postId);

    Page<PostSummaryResponse> getPostPage(
        int page,
        int size,
        String sortBy,
        Sort.Direction direction,
        String keyword,
        String type   // ALL, TITLE, CONTENT, TITLE_CONTENT, USER
    );
}
