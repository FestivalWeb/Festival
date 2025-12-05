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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final MediaFileRepository mediaFileRepository;
    private final UserRepository userRepository;

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

    private PostSummaryResponse toSummaryResponse(post p) {
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
                .userId(p.getUser().getUserId()) // [수정] 객체 탐색 (getUserId() -> getUser().getUserId())
                .view(p.getView())
                .createDate(p.getCreateDate())
                .thumbnailFileId(thumbnailId)
                .thumbnailUri(thumbnailUri)
                .build();
    }

    // ---------------- 기능 구현 ----------------

    @Override
    public PostCreateResponse createPost(String loginUserId, PostCreateRequest request) {
        
        // 1. 작성자 찾기
        UserEntity writer = userRepository.findById(loginUserId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 2. 게시글 생성 (객체 주입)
        post newPost = post.builder()
                .title(request.getTitle())
                .context(request.getContext())
                .user(writer) // [수정] user 객체 넣기
                .build();

        post savedPost = postRepository.save(newPost);

        // 3. 이미지 저장
        List<Long> fileIds = request.getFileIds();
        if (fileIds != null && !fileIds.isEmpty()) {
            List<MediaFile> files = mediaFileRepository.findAllById(fileIds);
            for (MediaFile file : files) {
                PostImgMapping mapping = PostImgMapping.builder()
                        .post(savedPost)
                        .file(file)
                        .build();
                savedPost.getImages().add(mapping);
            }
        }

        return PostCreateResponse.builder()
                .postId(savedPost.getPostId())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostSummaryResponse> getPostPage(int page, int size, String sortBy, Sort.Direction direction, String keyword, String type) {
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<post> postPage;

        if (keyword == null || keyword.isBlank()) {
            postPage = postRepository.findAll(pageable);
        } else {
            String k = keyword.trim();
            if ("TITLE".equalsIgnoreCase(type)) {
                postPage = postRepository.findByTitleContainingIgnoreCase(k, pageable);
            } else if ("CONTENT".equalsIgnoreCase(type)) {
                postPage = postRepository.findByContextContainingIgnoreCase(k, pageable);
            } else if ("USER".equalsIgnoreCase(type)) {
                // [수정] Repository 메서드명 변경 반영
                postPage = postRepository.findByUser_UserIdContainingIgnoreCase(k, pageable);
            } else {
                postPage = postRepository.findByTitleContainingIgnoreCaseOrContextContainingIgnoreCase(k, k, pageable);
            }
        }
        return postPage.map(this::toSummaryResponse);
    }

    @Override
    @Transactional
    public PostDetailResponse getPostDetail(Long postId) {
        post entity = postRepository.findById(postId)
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
                .userId(entity.getUser().getUserId()) // [수정] 객체 탐색
                .view(entity.getView() + 1)
                .createDate(entity.getCreateDate())
                .updateDate(entity.getUpdateDate())
                .images(images)
                .build();
    }

    @Override
    public PostDetailResponse updatePost(String loginUserId, Long postId, PostUpdateRequest request) {
        post entity = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음"));

        // [수정] 작성자 확인 (객체 탐색)
        if (!entity.getUser().getUserId().equals(loginUserId)) {
            throw new IllegalStateException("본인 글만 수정 가능합니다.");
        }

        entity.updatePost(request.getTitle(), request.getContext());

        entity.getImages().clear();
        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            List<MediaFile> files = mediaFileRepository.findAllById(request.getFileIds());
            for (MediaFile file : files) {
                PostImgMapping mapping = PostImgMapping.builder().post(entity).file(file).build();
                entity.getImages().add(mapping);
            }
        }
        
        return getPostDetail(postId);
    }

    @Override
    public void deletePost(String loginUserId, Long postId) {
        post entity = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음"));

        // [수정] 작성자 확인 (객체 탐색)
        if (!entity.getUser().getUserId().equals(loginUserId)) {
            throw new IllegalStateException("본인 글만 삭제 가능합니다.");
        }
        postRepository.delete(entity);
    }

    @Override
    public List<PostSummaryResponse> getPostList() {
        return getPostPage(0, 100, "postId", Sort.Direction.DESC, null, "ALL").getContent();
    }
}