package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.board.AdminPostResponse;
import org.zerock.backend.admin.dto.board.AdminPostUpdateRequest;
import org.zerock.backend.entity.*;
import org.zerock.backend.repository.*;

import java.util.List;

import org.zerock.backend.repository.PostImgMappingRepository;
import org.zerock.backend.entity.PostImgMapping;
import org.zerock.backend.entity.PostImgMappingId;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminPostService {

    private final PostRepository postRepository;

    // 이미지 처리를 위한 리포지토리 주입
    private final MediaFileRepository mediaFileRepository;
    private final PostImgMappingRepository postImgMappingRepository;

    /**
     * [관리자 전용] 게시글 삭제
     */
    public void deletePostByAdmin(Long postId) {
        Post target = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("글이 존재하지 않습니다."));
        
        postRepository.delete(target);
    }
    
    // 수정 메서드
    public void updateAdminPost(Long postId, AdminPostUpdateRequest request, Long adminId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다."));

        post.updatePost(request.getTitle(), request.getContent());

        // 이미지 수정 로직
        if (request.getFileIds() != null) { 
            postImgMappingRepository.deleteByPost(post); 
            
            if (!request.getFileIds().isEmpty()) {
                List<MediaFile> files = mediaFileRepository.findAllById(request.getFileIds());
                for (MediaFile file : files) {
                    PostImgMappingId mappingId = PostImgMappingId.builder()
                            .postId(post.getPostId())
                            .fileId(file.getFileId())
                            .build();

                    PostImgMapping mapping = PostImgMapping.builder()
                            .id(mappingId)
                            .post(post)
                            .file(file) // [핵심 수정] .mediaFile(file) -> .file(file)
                            .build();
                    
                    postImgMappingRepository.save(mapping);
                }
            }
        }
    }

    // 상세 조회 메서드
    @Transactional(readOnly = true)
    public AdminPostResponse getAdminPostDetail(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다."));
        
        return AdminPostResponse.from(post);
    }

    // 전체 목록 조회
    @Transactional(readOnly = true)
    public java.util.List<org.zerock.backend.admin.dto.board.AdminPostResponse> getAllPosts() {
        java.util.List<Post> posts = postRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createDate"));
        
        return posts.stream()
                .map(org.zerock.backend.admin.dto.board.AdminPostResponse::from)
                .collect(java.util.stream.Collectors.toList());
    }
}