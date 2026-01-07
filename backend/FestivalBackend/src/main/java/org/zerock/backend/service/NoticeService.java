package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.dto.*;
import org.zerock.backend.entity.*;
import org.zerock.backend.repository.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final AdminUserRepository adminUserRepository;
    private final MediaFileRepository mediaFileRepository;

    private final GalleryAlbumRepository galleryAlbumRepository;
    private final GalleryItemRepository galleryItemRepository;
    private final GalleryCategoryRepository galleryCategoryRepository;
    private final ItemMediaRepository itemMediaRepository;
    private final NoticeImageMappingRepository noticeImageMappingRepository;

    // 1. 공지사항 작성
    public Long createNotice(String adminId, NoticeDto.CreateRequest request) {
        Long adminIdLong = Long.parseLong(adminId);
        AdminUser admin = adminUserRepository.findById(adminIdLong)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자입니다."));

        Notice notice = Notice.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .important(request.isImportant())
                .adminUser(admin)
                .createDate(LocalDateTime.now())
                .viewCount(0L)
                .build();
        
        Notice savedNotice = noticeRepository.save(notice);

        // 이미지 연결
        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            List<MediaFile> files = mediaFileRepository.findAllById(request.getFileIds());

            for (MediaFile file : files) {
                // 매핑 테이블 저장
                NoticeImageId imageId = NoticeImageId.builder()
                        .noticeId(savedNotice.getNoticeId())
                        .fileId(file.getFileId())
                        .build();
                NoticeImageMapping mapping = NoticeImageMapping.builder()
                        .id(imageId)
                        .notice(savedNotice)
                        .mediaFile(file)
                        .build();
                noticeImageMappingRepository.save(mapping);

                // ▼▼▼ [핵심] 갤러리 자동 노출을 위해 주인 설정! ▼▼▼
                file.setNotice(savedNotice);
                mediaFileRepository.save(file);
            }
        }
        return savedNotice.getNoticeId();
    }

    // [내부 메서드] 갤러리 등록 (기존 유지)
    private void createGalleryFromNotice(Notice savedNotice, List<MediaFile> files, Long adminId) {
        GalleryCategory category = galleryCategoryRepository.findByCode("NOTICE")
                .orElseThrow(() -> new IllegalStateException("NOTICE 카테고리가 없습니다."));

        GalleryAlbum album = new GalleryAlbum();
        album.setCategory(category);
        album.setTitle(savedNotice.getTitle());
        album.setCoverFile(files.get(0));
        album.setVisibility(Visibility.PUBLIC);
        album.setActive(true);
        album.setCreatedBy(adminId);
        album.setCreateAt(LocalDateTime.now());
        album.setUpdatedAt(LocalDateTime.now());
        GalleryAlbum savedAlbum = galleryAlbumRepository.save(album);

        GalleryItem galleryItem = new GalleryItem();
        galleryItem.setAlbum(savedAlbum);
        galleryItem.setTitle(savedNotice.getTitle());
        galleryItem.setAdminId(adminId);
        galleryItem.setStatus(true);
        galleryItem.setCreatedAt(LocalDateTime.now());
        galleryItem.setUpdatedAt(LocalDateTime.now());
        GalleryItem savedItem = galleryItemRepository.save(galleryItem);

        for (MediaFile file : files) {
            ItemMediaId itemMediaId = ItemMediaId.builder()
                    .itemId(savedItem.getId())
                    .fileId(file.getFileId())
                    .build();

            ItemMedia itemMedia = ItemMedia.builder()
                    .id(itemMediaId)
                    .item(savedItem)
                    .mediaFile(file)
                    .build();
            itemMediaRepository.save(itemMedia);
        }
    }

    // 2. 목록 조회 (기존 유지)
    @Transactional(readOnly = true)
    public Page<NoticeDto.Response> getNoticeList(int page, int size, String keyword) {
        Sort sort = Sort.by(Sort.Order.desc("important"), Sort.Order.desc("createDate"));
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Notice> noticePage;
        if (keyword == null || keyword.isBlank()) {
            noticePage = noticeRepository.findAll(pageable);
        } else {
            noticePage = noticeRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword, pageable);
        }
        return noticePage.map(this::toResponse);
    }

    // 3. 상세 조회 (조회수 증가 로직)
    @Transactional
    public NoticeDto.Response getNoticeDetail(Long noticeId) {
        noticeRepository.increaseViewCount(noticeId);
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공지사항입니다."));
        return toResponse(notice);
    }

   // 4. 공지사항 수정 (이미지 갱신 로직 개선)
    public void updateNotice(Long noticeId, NoticeDto.CreateRequest request) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공지사항입니다."));

        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        notice.setImportant(request.isImportant());

        // [핵심] 기존 이미지 정리 (갤러리 중복 방지)
        // 1. 기존에 연결된 파일들의 notice 참조를 끊어줌 (NULL 처리)
        for (NoticeImageMapping mapping : notice.getImages()) {
            if (mapping.getMediaFile() != null) {
                mapping.getMediaFile().setNotice(null); // 갤러리에서 안 보이게 됨
                mediaFileRepository.save(mapping.getMediaFile());
            }
        }
        // 2. 매핑 테이블 비우기
        notice.getImages().clear();
        noticeImageMappingRepository.deleteByNotice(notice);

        // 3. 새 이미지 등록
        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            List<MediaFile> files = mediaFileRepository.findAllById(request.getFileIds());
            for (MediaFile file : files) {
                NoticeImageId imageId = NoticeImageId.builder()
                        .noticeId(notice.getNoticeId())
                        .fileId(file.getFileId())
                        .build();
                NoticeImageMapping mapping = NoticeImageMapping.builder()
                        .id(imageId)
                        .notice(notice)
                        .mediaFile(file)
                        .build();
                noticeImageMappingRepository.save(mapping);
                
                // [핵심] 새 파일 주인 설정
                file.setNotice(notice);
                mediaFileRepository.save(file);
            }
        }
    }

    // 5. 공지사항 삭제 (수정)
public void deleteNotice(Long noticeId) {
    Notice notice = noticeRepository.findById(noticeId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공지사항입니다."));

    // [단계 1] 연결된 MediaFile들이 공지사항을 참조하지 않도록 null 처리
    // (이 작업을 안 하면 MediaFile 쪽 외래 키 제약 조건이나 고아 객체 문제가 발생할 수 있음)
    for (NoticeImageMapping mapping : notice.getImages()) {
        if (mapping.getMediaFile() != null) {
            mapping.getMediaFile().setNotice(null); // FK 끊기
            mediaFileRepository.save(mapping.getMediaFile());
        }
    }

    // [단계 2] 매핑 테이블(notice_img_mapping) 데이터 명시적 삭제
    // JPA의 orphanRemoval에만 의존하지 않고 리포지토리를 통해 직접 삭제하여 확실하게 처리
    notice.getImages().clear(); // 영속성 컨텍스트(1차 캐시) 비우기
    noticeImageMappingRepository.deleteByNotice(notice); // DB에서 매핑 삭제

    // [단계 3] 공지사항 본문 삭제
    noticeRepository.delete(notice);
}

   private NoticeDto.Response toResponse(Notice n) {
        List<PostImageResponse> images = n.getImages().stream()
                .filter(img -> img.getMediaFile() != null)
                .map(img -> PostImageResponse.builder()
                        .fileId(img.getMediaFile().getFileId())
                        .storageUri(img.getMediaFile().getStorageUri())
                        .thumbUri(img.getMediaFile().getThumbUri())
                        .build())
                .collect(Collectors.toList());
        String writerName = (n.getAdminUser() != null) ? n.getAdminUser().getName() : "관리자";
        return NoticeDto.Response.builder()
                .noticeId(n.getNoticeId())
                .title(n.getTitle())
                .content(n.getContent())
                .important(n.isImportant())
                .viewCount(n.getViewCount())
                .createDate(n.getCreateDate())
                .writer(writerName)
                .images(images)
                .build();
    }
}