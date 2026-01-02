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
import org.zerock.backend.repository.BoardRepository;
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
    private final BoardRepository boardRepository;
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

    // [수정] 위에서 고친 DTO의 from 메서드 사용
    private PostSummaryResponse toSummaryResponse(Post p) {
        return PostSummaryResponse.from(p);
    }

    // ---------------- 기능 구현 ----------------

    @Override
    @SuppressWarnings("null")
    public PostCreateResponse createPost(String loginUserId, PostCreateRequest request) {
        UserEntity writer = userRepository.findById(loginUserId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // [추가] 게시판 정보 조회 (기본값 1번 '자유게시판' 사용)
        // 만약 request에 boardId가 있다면 그것을 사용하도록 로직 변경 가능
        Long boardId = (request.getBoardId() != null) ? request.getBoardId() : 1L;
        
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다."));

        Post newPost = Post.builder()
                .title(request.getTitle())
                .context(request.getContext())
                .user(writer)
                .board(board)
                .createDate(java.time.LocalDateTime.now())
                .build();

        Post savedPost = postRepository.save(newPost);

        List<Long> fileIds = request.getFileIds();

        if (fileIds != null && !fileIds.isEmpty()) {
            List<MediaFile> files = mediaFileRepository.findAllById(fileIds);

            for (MediaFile file : files) {
                PostImgMappingId mappingId = new PostImgMappingId(savedPost.getPostId(), file.getFileId());
                PostImgMapping mapping = PostImgMapping.builder()
                        .id(mappingId)
                        .post(savedPost)
                        .file(file)
                        .build();
                postImgMappingRepository.save(mapping);

                file.setPost(savedPost); 
                mediaFileRepository.save(file);
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
    @Transactional // [수정] 조회수 증가를 위해 readOnly 해제
    @SuppressWarnings("null")
    public PostDetailResponse getPostDetail(Long postId) {
        // 1. 조회수 먼저 증가 (DB 반영)
        postRepository.increaseViewCount(postId);

        // 2. 데이터 조회 (증가된 조회수 포함)
        Post entity = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        List<PostImageResponse> images = entity.getImages().stream()
                .filter(m -> m.getFile() != null)
                .map(m -> toImageResponse(m.getFile()))
                .collect(Collectors.toList());

        return PostDetailResponse.builder()
                .postId(entity.getPostId())
                .title(entity.getTitle())
                .context(entity.getContext())
                .userId(entity.getUser().getUserId())
                .view(entity.getView()) // 최신 조회수 반환
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

        entity.updatePost(request.getTitle(), request.getContext());

        // 1. 기존 이미지들의 Post 연결 끊기 (갤러리에서 사라짐)
        for (PostImgMapping mapping : entity.getImages()) {
            if (mapping.getFile() != null) {
                mapping.getFile().setPost(null);
                mediaFileRepository.save(mapping.getFile());
            }
        }
        
        // 2. 매핑 삭제
        entity.getImages().clear();
        postImgMappingRepository.deleteByPost_PostId(entity.getPostId()); 
        
        // 3. 새 이미지 등록
        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            List<MediaFile> files = mediaFileRepository.findAllById(request.getFileIds());
            for (MediaFile file : files) {
                PostImgMappingId mappingId = new PostImgMappingId(entity.getPostId(), file.getFileId());
                PostImgMapping mapping = PostImgMapping.builder()
                        .id(mappingId)
                        .post(entity)
                        .file(file)
                        .build();
                postImgMappingRepository.save(mapping);
                
                // 새 주인 설정
                file.setPost(entity);
                mediaFileRepository.save(file);
            }
        }
        
        // 결과 반환 (빌더 사용)
        return PostDetailResponse.builder()
                .postId(entity.getPostId())
                .title(entity.getTitle())
                .context(entity.getContext())
                .userId(entity.getUser().getUserId())
                .view(entity.getView())
                .createDate(entity.getCreateDate())
                .updateDate(entity.getUpdateDate())
                .images(entity.getImages().stream()
                        .filter(m -> m.getFile() != null)
                        .map(m -> PostImageResponse.builder() // 간단 변환
                            .fileId(m.getFile().getFileId())
                            .storageUri(m.getFile().getStorageUri())
                            .build())
                        .collect(Collectors.toList()))
                .build();
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
        // Post가 있거나 Notice가 있는 파일들 모두 조회
        List<MediaFile> files = mediaFileRepository.findByPostIsNotNullOrNoticeIsNotNullOrderByFileIdDesc();

        return files.stream().map(file -> {
            String writer = "알수없음";
            String title = "제목없음";
            Long id = 0L; // PostId or NoticeId
            String type = "UNKNOWN";

            // 게시글 이미지인 경우
            if (file.getPost() != null) {
                writer = (file.getPost().getUser() != null) ? file.getPost().getUser().getUserId() : "알수없음";
                title = file.getPost().getTitle();
                id = file.getPost().getPostId();
                type = "POST";
            } 
            // 공지사항 이미지인 경우
            else if (file.getNotice() != null) {
                writer = (file.getNotice().getAdminUser() != null) ? file.getNotice().getAdminUser().getName() : "관리자";
                title = file.getNotice().getTitle();
                id = file.getNotice().getNoticeId();
                type = "NOTICE";
            }

            String uri = (file.getThumbUri() != null) ? file.getThumbUri() : file.getStorageUri();

            return PostGalleryResponse.builder()
                    .fileId(file.getFileId())
                    .imageUri(uri)
                    .title(title)
                    .writer(writer)
                    .postId(id) // 프론트에서 클릭 시 이동할 ID
                    .type(type)
                    .build();
        }).collect(Collectors.toList());
    }
}