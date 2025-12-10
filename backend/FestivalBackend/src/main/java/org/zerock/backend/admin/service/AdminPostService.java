package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.board.AdminPostResponse;
import org.zerock.backend.admin.dto.board.AdminPostUpdateRequest;
import org.zerock.backend.entity.AdminUser;
import org.zerock.backend.entity.Board;
import org.zerock.backend.entity.post; // (클래스명 post -> Post 권장)
import org.zerock.backend.repository.AdminUserRepository;
import org.zerock.backend.repository.BoardRepository;
import org.zerock.backend.repository.PostRepository; // noticeRepository 대신 사용

@Service
@RequiredArgsConstructor
@Transactional
public class AdminPostService {

    private final PostRepository postRepository;      // 통합된 게시글 리포지토리
    private final BoardRepository boardRepository;    // 게시판 정보 조회용
    private final AdminUserRepository adminUserRepository;

    /**
     * [관리자 전용] 게시글 작성
     * - 공지사항(Notice) 뿐만 아니라, 자유게시판 등에 관리자 권한으로 글을 쓸 때도 사용
     */
    public Long createAdminPost(Long boardId, String title, String content, Long adminId, boolean isImportant) {
        
        // 1. 작성자(관리자) 확인
        AdminUser admin = adminUserRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자입니다."));

        // 2. 게시판 확인 (이 글이 공지사항인지, 자유게시판인지)
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시판입니다."));

        // 3. 게시글 엔티티 생성 (기존 Notice 대신 post 사용)
        post newPost = post.builder()
                .title(title)
                .context(content)
                .board(board)       // ★ 핵심: 게시판 연결
                .adminId(adminId)   // 관리자 ID 기록
                .userId(null)       // 유저 ID는 비움
                .build();

        // (선택사항) 상단 고정(important) 기능이 post 테이블에 없다면?
        // -> post 테이블에 'is_notice' 컬럼을 추가하거나, 제목 앞에 "[공지]"를 붙이는 식으로 처리
        if (isImportant) {
            // newPost.setImportant(true); // 컬럼이 있다면 사용
            // 없을 경우 제목에 표시하는 방법 예시:
            // newPost.updatePost("[중요] " + title, content);
        }

        // 4. 저장
        post savedPost = postRepository.save(newPost);
        
        // 5. 게시판의 전체 글 개수 증가 업데이트 (옵션)
        // board.setPostCount(board.getPostCount() + 1);

        return savedPost.getPostId();
    }

    /**
     * [관리자 전용] 게시글 삭제
     * - 관리자는 본인 글뿐만 아니라, 유저가 쓴 글도 삭제할 수 있어야 함 (분쟁 조정 등)
     */
    public void deletePostByAdmin(Long postId) {
        post target = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("글이 존재하지 않습니다."));
        
        // 별도의 권한 체크 없이 바로 삭제 (관리자니까!)
        postRepository.delete(target);
    }
    
    // 1. 수정 메서드
    public void updateAdminPost(Long postId, AdminPostUpdateRequest request, Long adminId) {
        post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다."));

        // (옵션) 관리자라도 본인이 쓴 글만 수정 가능하게 하려면 여기서 adminId 체크
        // if (!post.getAdminId().equals(adminId)) { throw ... }

        post.updatePost(request.getTitle(), request.getContent());
        
        // 만약 important 같은 필드가 post 엔티티에 있다면 여기서 업데이트
        // if (request.isImportant()) ...
    }

    // 2. 상세 조회 메서드 (DTO 변환)
    @Transactional(readOnly = true)
    public AdminPostResponse getAdminPostDetail(Long postId) {
        post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다."));
        
        // 엔티티 -> DTO 변환 (DTO에 만들어둔 from 메서드 활용)
        return AdminPostResponse.from(post);
    }
    // 수정 로직 등 추가 구현...
}