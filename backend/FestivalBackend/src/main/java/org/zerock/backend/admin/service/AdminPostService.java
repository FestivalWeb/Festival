package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.board.AdminPostResponse;
import org.zerock.backend.admin.dto.board.AdminPostUpdateRequest;
import org.zerock.backend.entity.AdminUser;
import org.zerock.backend.entity.Board;
import org.zerock.backend.entity.Post;
import org.zerock.backend.repository.AdminUserRepository;
import org.zerock.backend.repository.BoardRepository;
import org.zerock.backend.repository.PostRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminPostService {

    private final PostRepository postRepository;
    private final BoardRepository boardRepository;
    private final AdminUserRepository adminUserRepository;

    /**
     * [관리자 전용] 게시글 작성
     */
    public Long createAdminPost(Long boardId, String title, String content, Long adminId, boolean isImportant) {
        
        // 1. 작성자(관리자) 객체 조회
        AdminUser admin = adminUserRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자입니다."));

        // 2. 게시판 조회
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시판입니다."));

        // 3. 게시글 엔티티 생성
        Post newPost = Post.builder()
                .title(title)
                .context(content)
                .board(board)        // 게시판 연결
                .adminUser(admin)    // [수정] .adminId(adminId) -> .adminUser(admin) (객체 주입)
                .user(null)          // [수정] .userId(null) -> .user(null) (Post 엔티티 필드명이 user임)
                .build();

        // (선택사항) 중요(공지) 글 표시 로직
        if (isImportant) {
            // 예: 제목 앞에 [공지] 추가
             newPost.updatePost("[공지] " + title, content);
        }

        // 4. 저장
        Post savedPost = postRepository.save(newPost);
        
        return savedPost.getPostId();
    }

    /**
     * [관리자 전용] 게시글 삭제
     */
    public void deletePostByAdmin(Long postId) {
        Post target = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("글이 존재하지 않습니다."));
        
        postRepository.delete(target);
    }
    
    // 1. 수정 메서드
    public void updateAdminPost(Long postId, AdminPostUpdateRequest request, Long adminId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다."));

        // 내용 수정
        post.updatePost(request.getTitle(), request.getContent());
    }

    // 2. 상세 조회 메서드
    @Transactional(readOnly = true)
    public AdminPostResponse getAdminPostDetail(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다."));
        
        // 엔티티 -> DTO 변환
        return AdminPostResponse.from(post);
    }
}