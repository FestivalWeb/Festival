package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.dto.*;
import org.zerock.backend.entity.*;
import org.zerock.backend.repository.*;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final AdminUserRepository adminUserRepository;
    private final MediaFileRepository mediaFileRepository;

    // 1. 공지사항 작성 (관리자용)
    public Long createNotice(String adminId, NoticeDto.CreateRequest request) {
        // [수정 1] String adminId -> Long 변환
        Long adminIdLong = Long.parseLong(adminId);

        AdminUser admin = adminUserRepository.findById(adminIdLong)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자입니다."));

        Notice notice = Notice.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .important(request.isImportant())
                .adminUser(admin)
                .build();

        Notice savedNotice = noticeRepository.save(notice);

        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            List<MediaFile> files = mediaFileRepository.findAllById(request.getFileIds());
            for (MediaFile file : files) {
                NoticeImageMapping mapping = NoticeImageMapping.builder()
                        .notice(savedNotice)
                        // [수정 2] 엔티티 필드명에 맞춰 .mediaFile() 사용 (만약 엔티티가 file이라면 .file()로 유지)
                        .mediaFile(file) 
                        .build();
                savedNotice.getImages().add(mapping);
            }
        }
        return savedNotice.getNoticeId();
    }

    // 2. 목록 조회
    @Transactional(readOnly = true)
    public Page<NoticeDto.Response> getNoticeList(int page, int size, String keyword) {
        Sort sort = Sort.by(Sort.Order.desc("important"), Sort.Order.desc("createDate"));
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Notice> noticePage;
        if (keyword == null || keyword.isBlank()) {
            noticePage = noticeRepository.findAll(pageable);
        } else {
            // 이 메서드는 아래 Repository에서 정의해줘야 합니다.
            noticePage = noticeRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword, pageable);
        }

        return noticePage.map(this::toResponse);
    }

    // 3. 상세 조회
    public NoticeDto.Response getNoticeDetail(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공지사항입니다."));

        noticeRepository.increaseViewCount(noticeId);

        return toResponse(notice);
    }

    private NoticeDto.Response toResponse(Notice n) {
        // [수정 2 관련] 여기서도 getMediaFile()을 사용해야 할 수 있습니다.
        List<PostImageResponse> images = n.getImages().stream()
                .filter(img -> img.getMediaFile() != null) // .getFile() 대신 .getMediaFile() 확인 필요
                .map(img -> PostImageResponse.builder()
                        .fileId(img.getMediaFile().getFileId())
                        .storageUri(img.getMediaFile().getStorageUri())
                        .thumbUri(img.getMediaFile().getThumbUri())
                        .build())
                .collect(Collectors.toList());

        String adminName = (n.getAdminUser() != null) ? n.getAdminUser().getName() : "관리자";

        return NoticeDto.Response.builder()
                .noticeId(n.getNoticeId())
                .title(n.getTitle())
                .content(n.getContent())
                .important(n.isImportant())
                .viewCount(n.getViewCount())
                .createDate(n.getCreateDate())
                .adminName(adminName)
                .images(images)
                .build();
    }
}