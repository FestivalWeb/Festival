package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.dto.PostCreateRequest;
import org.zerock.backend.dto.PostCreateResponse;
import org.zerock.backend.dto.PostDetailResponse;
import org.zerock.backend.dto.PostImageResponse;
import org.zerock.backend.dto.PostSummaryResponse;
import org.zerock.backend.dto.PostUpdateRequest;
import org.zerock.backend.entity.MediaFile;
import org.zerock.backend.entity.PostImgMapping;
import org.zerock.backend.entity.post;
import org.zerock.backend.repository.MediaFileRepository;
import org.zerock.backend.repository.PostImgMappingRepository;
import org.zerock.backend.repository.PostRepository;

import java.util.stream.Collectors;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {

        private final PostRepository postRepository;
        private final MediaFileRepository mediaFileRepository;
        private final PostImgMappingRepository postImgMappingRepository;

        private PostImageResponse toImageResponse(MediaFile file) {
                return PostImageResponse.builder().fileId(file.getFileId()).storageUri(file.getStorageUri())
                                .thumbUri(file.getThumbUri()).type(file.getType()).sizeBytes(file.getSizeBytes())
                                .width(file.getWeight()).height(file.getHeight()).durationSec(file.getDurationSec())
                                .build();
        }

        @Override
        public PostCreateResponse createPost(String loginUserId, PostCreateRequest request) {

                // 1) 게시글 엔티티 생성 (post.java 의 @Builder 사용)
                post newPost = post.builder()
                                .title(request.getTitle())
                                .context(request.getContext())
                                .userId(loginUserId) // 회원 아이디
                                .adminId(0L) // 회원 작성 글이므로 0L 같은 기본값
                                .build();
                // createDate / updateDate / view 는 Auditing + @DynamicInsert 로 처리

                // 2) 먼저 게시글 저장
                post savedPost = postRepository.save(newPost);

                // 3) 첨부 이미지가 있으면 mapping 엔티티 저장
                List<Long> fileIds = request.getFileIds();
                if (fileIds != null && !fileIds.isEmpty()) {

                        for (Long fileId : fileIds) {
                                MediaFile file = mediaFileRepository.findById(fileId)
                                                .orElseThrow(() -> new IllegalArgumentException(
                                                                "존재하지 않는 파일 ID: " + fileId));

                                // ManyToOne 연관관계를 사용하는 PostImgMapping
                                PostImgMapping mapping = PostImgMapping.builder()
                                                .post(savedPost)
                                                .file(file)
                                                .build();

                                postImgMappingRepository.save(mapping);

                                // 양방향 컬렉션 유지 (선택)
                                savedPost.getImages().add(mapping);
                        }
                }

                return PostCreateResponse.builder()
                                .postId(savedPost.getPostId())
                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public List<PostSummaryResponse> getPostList() {

                List<post> posts = postRepository.findAll(
                                Sort.by(Sort.Direction.DESC, "postId"));

                return posts.stream()
                                .map(p -> {
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
                                                        .createDate(p.getCreateDate()) // 이제 안전하게 사용 가능
                                                        .thumbnailFileId(thumbnailId)
                                                        .thumbnailUri(thumbnailUri)
                                                        .build();
                                })
                                .toList();
        }

        @Override 
        @Transactional
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

        @Override
        @Transactional
        public PostDetailResponse updatePost(String loginUserId,
                        Long postId,
                        PostUpdateRequest request) {

                // 1) 글 찾기
                post entity = postRepository.findById(postId)
                                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다. id=" + postId));

                // 2) 작성자 체크
                if (!entity.getUserId().equals(loginUserId)) {
                        throw new IllegalStateException("작성자만 글을 수정할 수 있습니다.");
                }

                // 3) 제목/내용 수정
                entity.updatePost(request.getTitle(), request.getContext());
                // updateDate 는 JPA Auditing 이 자동으로 세팅

                // 4) 이미지 매핑 수정
                // - 일단 기존 매핑 제거 (orphanRemoval=true 라서 DB에서도 삭제됨)
                entity.getImages().clear();

                // - 새 fileIds 기준으로 다시 매핑 생성
                if (request.getFileIds() != null) {
                        for (Long fileId : request.getFileIds()) {

                                MediaFile file = mediaFileRepository.findById(fileId)
                                                .orElseThrow(() -> new IllegalArgumentException(
                                                                "존재하지 않는 파일 ID: " + fileId));

                                PostImgMapping mapping = PostImgMapping.builder()
                                                .post(entity)
                                                .file(file)
                                                .build();

                                entity.getImages().add(mapping); // CascadeType.ALL + orphanRemoval 로 자동 저장
                        }
                }

                // 5) 수정된 결과를 상세 DTO로 변환해서 반환
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

        @Override
        @Transactional
        public void deletePost(String loginUserId, Long postId) {

                post entity = postRepository.findById(postId)
                                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다. id=" + postId));

                // 작성자 체크
                if (!entity.getUserId().equals(loginUserId)) {
                        throw new IllegalStateException("작성자만 글을 삭제할 수 있습니다.");
                }

                // 연관된 PostImgMapping 도 함께 삭제됨 (orphanRemoval, cascade)
                postRepository.delete(entity);
        }

}
