package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.dto.*;
import org.zerock.backend.entity.*;
import org.zerock.backend.repository.MediaFileRepository;
import org.zerock.backend.repository.PostRepository;
import org.zerock.backend.repository.UserRepository;
import org.zerock.backend.repository.PostImgMappingRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final MediaFileRepository mediaFileRepository;
    private final UserRepository userRepository;
    private final PostImgMappingRepository postImgMappingRepository; 

    // ---------------- 변환 메서드 ----------------

    private PostImageResponse toImageResponse(MediaFile file) {
        return PostImageResponse.builder()
                .fileId(file.getFileId())
                .storageUri(file.getStorageUri())
                .thumbUri(file.getThumbUri())
                .type(file.getType())
                .sizeBytes(file.getSizeBytes())
                .width(file.getWeight())
                .height(file.getHeight())
                .durationSec(file.getDurationSec())
                .build();
    }

    private PostSummaryResponse toSummaryResponse(Post p) {
        Long thumbnailId = null;
        String thumbnailUri = null;

        if (p.getImages() != null && !p.getImages().isEmpty()) {
            PostImgMapping first = p.getImages().iterator().next();
            if (first.getFile() != null) {
                MediaFile file = first.getFile();
                thumbnailId = file.getFileId();
                thumbnailUri = (file.getThumbUri() != null) ? file.getThumbUri() : file.getStorageUri();
            }
        }

        return PostSummaryResponse.builder()
                .postId(p.getPostId())
                .title(p.getTitle())
                .userId(p.getUser().getUserId()) 
                .view(p.getView())
                .createDate(p.getCreateDate())
                .thumbnailFileId(thumbnailId)
                .thumbnailUri(thumbnailUri)
                .build();
    }

    // ---------------- 기능 구현 ----------------

   @Override
    @SuppressWarnings("null")
    public PostCreateResponse createPost(String loginUserId, PostCreateRequest request) {
        // 1. 작성자 확인 및 게시글 엔티티 생성
        UserEntity writer = userRepository.findById(loginUserId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        Post newPost = Post.builder()
                .title(request.getTitle())
                .context(request.getContext())
                .user(writer)
                .createDate(java.time.LocalDateTime.now())
                .build();

        // 2. 게시글 먼저 저장 (그래야 ID가 생김)
        Post savedPost = postRepository.save(newPost);

        // 3. 이미지 연결 (이 부분이 가장 중요합니다!)
        List<Long> fileIds = request.getFileIds();

        System.out.println("======================================");
        System.out.println("받은 파일 ID 목록: " + fileIds);
        if (fileIds != null && !fileIds.isEmpty()) {
            List<MediaFile> files = mediaFileRepository.findAllById(fileIds);

            for (MediaFile file : files) {
                // (1) 중간 테이블(매핑) 저장
                PostImgMappingId mappingId = new PostImgMappingId(savedPost.getPostId(), file.getFileId());
                PostImgMapping mapping = PostImgMapping.builder()
                        .id(mappingId)
                        .post(savedPost)
                        .file(file)
                        .build();
                postImgMappingRepository.save(mapping);

                // ▼▼▼ [필수 추가] 이 코드가 있어야 갤러리에 뜹니다! ▼▼▼
                // 파일 자체에 "이 게시글(5번)이 내 주인이야"라고 도장을 찍어줍니다.
                file.setPost(savedPost); 
                mediaFileRepository.save(file); // 변경된 내용(post_id)을 DB에 꼭 저장!
                // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
            }
        }

        return PostCreateResponse.builder()
                .postId(savedPost.getPostId())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public Page<PostSummaryResponse> getPostPage(int page, int size, String sortBy, Sort.Direction direction, String keyword, String type) {
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Post> postPage;

        if (keyword == null || keyword.isBlank()) {
            postPage = postRepository.findAll(pageable);
        } else {
            String k = keyword.trim();
            if ("TITLE".equalsIgnoreCase(type)) {
                postPage = postRepository.findByTitleContainingIgnoreCase(k, pageable);
            } else if ("CONTENT".equalsIgnoreCase(type)) {
                postPage = postRepository.findByContextContainingIgnoreCase(k, pageable);
            } else if ("USER".equalsIgnoreCase(type)) {
                postPage = postRepository.findByUser_UserIdContainingIgnoreCase(k, pageable);
            } else {
                postPage = postRepository.findByTitleContainingIgnoreCaseOrContextContainingIgnoreCase(k, k, pageable);
            }
        }
        return postPage.map(this::toSummaryResponse);
    }

    @Override
    @Transactional
    @SuppressWarnings("null")
    public PostDetailResponse getPostDetail(Long postId) {
        Post entity = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        postRepository.increaseViewCount(postId);

        List<PostImageResponse> images = entity.getImages().stream()
                .filter(m -> m.getFile() != null)
                .map(m -> toImageResponse(m.getFile()))
                .collect(Collectors.toList());

        return PostDetailResponse.builder()
                .postId(entity.getPostId())
                .title(entity.getTitle())
                .context(entity.getContext())
                .userId(entity.getUser().getUserId())
                .view(entity.getView() + 1)
                .createDate(entity.getCreateDate())
                .updateDate(entity.getUpdateDate())
                .images(images)
                .build();
    }

    @Override
    @SuppressWarnings("null")
    public PostDetailResponse updatePost(String loginUserId, Long postId, PostUpdateRequest request) {
        Post entity = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음"));

        if (!entity.getUser().getUserId().equals(loginUserId)) {
            throw new IllegalStateException("본인 글만 수정 가능합니다.");
        }

        // 내용 수정
        entity.updatePost(request.getTitle(), request.getContext());

        // [핵심 수정 1] 기존 이미지 삭제
        // orphanRemoval만 믿지 말고 리포지토리 메서드로 명시적 삭제 수행
        // 단, entity 컬렉션도 비워줘야 1차 캐시 정합성이 맞음
        entity.getImages().clear();
        postImgMappingRepository.deleteByPost_PostId(entity.getPostId()); 
        
        // [핵심 수정 2] 새 이미지 등록 부분
        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            List<MediaFile> files = mediaFileRepository.findAllById(request.getFileIds());
            for (MediaFile file : files) {
                // (1) 매핑 저장
                PostImgMappingId mappingId = new PostImgMappingId(entity.getPostId(), file.getFileId());
                PostImgMapping mapping = PostImgMapping.builder()
                        .id(mappingId)
                        .post(entity)
                        .file(file)
                        .build();
                postImgMappingRepository.save(mapping);
                
                // ▼▼▼ [필수 추가] 수정 시에도 주인 설정! ▼▼▼
                file.setPost(entity);
                mediaFileRepository.save(file);
                // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
            }
        }
        
        return getPostDetail(postId);
    }

    @Override
    @SuppressWarnings("null")
    public void deletePost(String loginUserId, Long postId) {
        Post entity = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음"));

        if (!entity.getUser().getUserId().equals(loginUserId)) {
            throw new IllegalStateException("본인 글만 삭제 가능합니다.");
        }
        postRepository.delete(entity);
    }

    @Override
    public List<PostSummaryResponse> getPostList() {
        return getPostPage(0, 100, "postId", Sort.Direction.DESC, null, "ALL").getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostGalleryResponse> getGalleryList() {
        // 1. 게시글이 있는 파일들만 DB에서 가져옴
        List<MediaFile> files = mediaFileRepository.findByPostIsNotNullOrderByFileIdDesc();

        // 2. DTO로 변환
        return files.stream().map(file -> {
            // 게시글 정보 가져오기 (혹시 null일까봐 안전장치)
            String writer = (file.getPost().getUser() != null) ? file.getPost().getUser().getUserId() : "알수없음";
            String title = file.getPost().getTitle();
            Long postId = file.getPost().getPostId();
            
            // 썸네일이 있으면 썸네일, 없으면 원본 이미지
            String uri = (file.getThumbUri() != null) ? file.getThumbUri() : file.getStorageUri();

            return PostGalleryResponse.builder()
                    .fileId(file.getFileId())
                    .imageUri(uri)
                    .title(title)
                    .writer(writer)
                    .postId(postId)
                    .build();
        }).collect(Collectors.toList());
    }
}   