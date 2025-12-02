package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.zerock.backend.dto.*;
import org.zerock.backend.entity.MediaFile;
import org.zerock.backend.entity.PostImgMapping;
import org.zerock.backend.entity.post;
import org.zerock.backend.repository.MediaFileRepository;
import org.zerock.backend.repository.PostRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final MediaFileRepository mediaFileRepository;
    // PostImgMappingRepository는 직접 save 안 쓰도록 정리했으니 제거해도 됨

    // ---------------- 공통 변환 함수들 ----------------

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

    /** 엔티티 -> 목록용 요약 DTO (썸네일 포함) */
    private PostSummaryResponse toSummaryResponse(post p) {

        Long thumbnailId = null;
        String thumbnailUri = null;

        // 첫 번째 이미지 기준으로 썸네일 정보 추출
        if (p.getImages() != null && !p.getImages().isEmpty()) {
            PostImgMapping first = p.getImages().iterator().next();
            if (first.getFile() != null) {
                MediaFile file = first.getFile();
                thumbnailId = file.getFileId();
                thumbnailUri = (file.getThumbUri() != null)
                        ? file.getThumbUri()
                        : file.getStorageUri();
            }
        }

        return PostSummaryResponse.builder()
                .postId(p.getPostId())
                .title(p.getTitle())
                .userId(p.getUserId())
                .view(p.getView())
                .createDate(p.getCreateDate())
                .thumbnailFileId(thumbnailId)
                .thumbnailUri(thumbnailUri)
                .build();
    }

    // ---------------- 글 작성 ----------------

    @Override
    @SuppressWarnings("null")
    public PostCreateResponse createPost(String loginUserId, PostCreateRequest request) {

        // 1) 게시글 엔티티 생성
        post newPost = post.builder()
                .title(request.getTitle())
                .context(request.getContext())
                .userId(loginUserId) // 회원 아이디
                .adminId(0L)         // 회원 작성 글이므로 0L 같은 기본값
                .build();

        // 2) 먼저 게시글 저장
        post savedPost = postRepository.save(newPost);

        // 3) 첨부 이미지가 있으면 mapping 엔티티 저장
        List<Long> fileIds = request.getFileIds();
        if (fileIds != null && !fileIds.isEmpty()) {
            for (Long fileId : fileIds) {
                MediaFile file = mediaFileRepository.findById(fileId)
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 파일 ID: " + fileId));

                PostImgMapping mapping = PostImgMapping.builder()
                        .post(savedPost)
                        .file(file)
                        .build();

                // ⚠️ 여기서 따로 save() 하지 않고,
                // Post 엔티티의 컬렉션에만 추가해서 cascade 로 저장되게 함
                savedPost.getImages().add(mapping);
            }
        }

        return PostCreateResponse.builder()
                .postId(savedPost.getPostId())
                .build();
    }

    // ---------------- 새로 추가: 페이징 + 검색/정렬 목록 ----------------

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public Page<PostSummaryResponse> getPostPage(
            int page,
            int size,
            String sortBy,
            Sort.Direction direction,
            String keyword,
            String type
    ) {
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<post> postPage;

        if (keyword == null || keyword.isBlank()) {
            // 검색어 없으면 전체
            postPage = postRepository.findAll(pageable);
        } else {
            String k = keyword.trim();

            // type 에 따라 검색 기준 분기
            if (type == null
                    || type.equalsIgnoreCase("ALL")
                    || type.equalsIgnoreCase("TITLE_CONTENT")) {

                postPage = postRepository
                        .findByTitleContainingIgnoreCaseOrContextContainingIgnoreCase(k, k, pageable);

            } else if (type.equalsIgnoreCase("TITLE")) {

                postPage = postRepository.findByTitleContainingIgnoreCase(k, pageable);

            } else if (type.equalsIgnoreCase("CONTENT")) {

                postPage = postRepository.findByContextContainingIgnoreCase(k, pageable);

            } else if (type.equalsIgnoreCase("USER")) {

                postPage = postRepository.findByUserIdContainingIgnoreCase(k, pageable);

            } else {
                // 이상한 type 이면 그냥 전체
                postPage = postRepository.findAll(pageable);
            }
        }

        // 엔티티 페이지 -> 요약 DTO 페이지
        return postPage.map(this::toSummaryResponse);
    }

    // 간단 목록용 (필요 없으면 나중에 삭제 가능)
    @Override
    @Transactional(readOnly = true)
    public List<PostSummaryResponse> getPostList() {
        Page<PostSummaryResponse> page =
                getPostPage(0, 100, "postId", Sort.Direction.DESC, null, "ALL");
        return page.getContent();
    }

    // ---------------- 글 상세 ----------------

    @Override
    @Transactional
    @SuppressWarnings("null")
    public PostDetailResponse getPostDetail(Long postId) {

        post entity = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다. id=" + postId));

        // 조회수 +1
        entity.increaseViewCount();

        // 이미지 DTO 리스트 생성
        List<PostImageResponse> images = entity.getImages().stream()
                .filter(mapping -> mapping.getFile() != null)
                .map(mapping -> toImageResponse(mapping.getFile()))
                .collect(Collectors.toList());

        return PostDetailResponse.builder()
                .postId(entity.getPostId())
                .title(entity.getTitle())
                .context(entity.getContext())
                .userId(entity.getUserId())
                .view(entity.getView())
                .createDate(entity.getCreateDate())
                .updateDate(entity.getUpdateDate())
                .images(images)
                .build();
    }

    // ---------------- 글 수정 ----------------

    @Override
    @Transactional
    @SuppressWarnings("null")
    public PostDetailResponse updatePost(String loginUserId,
                                         Long postId,
                                         PostUpdateRequest request) {

        post entity = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다. id=" + postId));

        if (!entity.getUserId().equals(loginUserId)) {
            throw new IllegalStateException("작성자만 글을 수정할 수 있습니다.");
        }

        // 제목/내용 수정
        entity.updatePost(request.getTitle(), request.getContext());

        // 이미지 매핑 재구성 (orphanRemoval = true 라서 기존 매핑은 자동 삭제)
        entity.getImages().clear();

        if (request.getFileIds() != null) {
            for (Long fileId : request.getFileIds()) {
                MediaFile file = mediaFileRepository.findById(fileId)
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 파일 ID: " + fileId));

                PostImgMapping mapping = PostImgMapping.builder()
                        .post(entity)
                        .file(file)
                        .build();

                entity.getImages().add(mapping); // cascade 로 새 매핑이 저장됨
            }
        }

        List<PostImageResponse> images = entity.getImages().stream()
                .filter(m -> m.getFile() != null)
                .map(m -> toImageResponse(m.getFile()))
                .toList();

        return PostDetailResponse.builder()
                .postId(entity.getPostId())
                .title(entity.getTitle())
                .context(entity.getContext())
                .userId(entity.getUserId())
                .view(entity.getView())
                .createDate(entity.getCreateDate())
                .updateDate(entity.getUpdateDate())
                .images(images)
                .build();
    }

    // ---------------- 글 삭제 ----------------

    @Override
    @Transactional
    @SuppressWarnings("null")
    public void deletePost(String loginUserId, Long postId) {

        post entity = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다. id=" + postId));

        if (!entity.getUserId().equals(loginUserId)) {
            throw new IllegalStateException("작성자만 글을 삭제할 수 있습니다.");
        }

        postRepository.delete(entity);
    }
}
