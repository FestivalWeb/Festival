package org.zerock.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.zerock.backend.dto.AlbumDetailResponse;
import org.zerock.backend.dto.AlbumListResponse;
import org.zerock.backend.dto.GalleryItemRequest;
import org.zerock.backend.dto.GalleryItemResponse;
import org.zerock.backend.entity.*;
import org.zerock.backend.repository.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GalleryService {

    private final GalleryAlbumRepository galleryAlbumRepository;
    private final GalleryItemRepository galleryItemRepository;
    private final GalleryCategoryRepository galleryCategoryRepository;
    private final MediaFileRepository mediaFileRepository;
    private final ItemMediaRepository itemMediaRepository;

    // ===========================
    //         조회 기능
    // ===========================

    /**
     * 1. 앨범 목록 조회
     */
    public Page<AlbumListResponse> getAlbumList(String categoryCode, String searchKeyword, Pageable pageable) {
        Page<GalleryAlbum> albumPage = galleryAlbumRepository.findAlbumsByCategoryAndKeyword(
                categoryCode,
                searchKeyword,
                pageable
        );
        return albumPage.map(AlbumListResponse::new);
    }

    /**
     * 2. 앨범 상세 조회
     */
    public AlbumDetailResponse getAlbumDetails(Long albumId) {
        GalleryAlbum album = galleryAlbumRepository.findById(albumId)
                .orElseThrow(() -> new EntityNotFoundException("앨범을 찾을 수 없습니다: " + albumId));

        // N+1 문제 해결된 쿼리 사용
        List<GalleryItem> items = galleryItemRepository.findItemsByAlbumIdWithMedia(albumId);

        List<GalleryItemResponse> itemResponses = items.stream()
                .map(GalleryItemResponse::new)
                .collect(Collectors.toList());

        return new AlbumDetailResponse(album, itemResponses);
    }

    /**
     * 3. 카테고리 전체 목록 조회
     */
    public List<GalleryCategory> getCategories() {
        return galleryCategoryRepository.findAll();
    }

    // ===========================
    //      생성/수정 기능 (CUD)
    // ===========================

    /**
     * 4. 앨범 생성 (관리자용)
     */
    @Transactional
    public Long createAlbum(String title, String categoryCode, Long coverFileId, Long adminId) {
        // 1. 카테고리 확인
        GalleryCategory category = galleryCategoryRepository.findByCode(categoryCode)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다: " + categoryCode));

        // 2. 커버 이미지 파일 확인 (없을 수도 있음)
        MediaFile coverFile = null;
        if (coverFileId != null) {
            coverFile = mediaFileRepository.findById(coverFileId)
                    .orElseThrow(() -> new IllegalArgumentException("파일이 존재하지 않습니다."));
        }

        // 3. 앨범 엔티티 생성
        GalleryAlbum album = new GalleryAlbum();
        album.setTitle(title);
        album.setCategory(category);
        album.setCoverFile(coverFile);
        album.setCreatedBy(adminId); // 관리자 ID 저장
        album.setCreateAt(LocalDateTime.now());
        album.setUpdatedAt(LocalDateTime.now());
        album.setActive(true);
        album.setVisibility(Visibility.PUBLIC);

        GalleryAlbum savedAlbum = galleryAlbumRepository.save(album);
        return savedAlbum.getId();
    }

    /**
     * 5. 앨범에 아이템(사진들) 등록
     */
    @Transactional
    public Long registerGalleryItem(Long albumId, Long adminId, GalleryItemRequest request) {
        // 1. 앨범 확인
        GalleryAlbum album = galleryAlbumRepository.findById(albumId)
                .orElseThrow(() -> new EntityNotFoundException("앨범 없음: " + albumId));

        // 2. 아이템(게시물) 엔티티 생성
        GalleryItem item = new GalleryItem();
        item.setAlbum(album);
        item.setTitle(request.getTitle());
        item.setCaption(request.getCaption());
        item.setLocation(request.getLocation());
        item.setAdminId(adminId);
        item.setStatus(true);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        // 아이템 먼저 저장 (그래야 ID가 생김)
        GalleryItem savedItem = galleryItemRepository.save(item);

        // 3. 업로드된 파일들과 연결 (ItemMedia 생성)
        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            List<MediaFile> mediaFiles = mediaFileRepository.findAllById(request.getFileIds());

            for (MediaFile file : mediaFiles) {
                // 복합키 생성
                ItemMediaId id = new ItemMediaId(savedItem.getId(), file.getFileId());

                // 매핑 엔티티 생성
                ItemMedia itemMedia = ItemMedia.builder()
                        .id(id)
                        .item(savedItem)
                        .mediaFile(file)
                        .build();

                itemMediaRepository.save(itemMedia);
            }
        }
        return savedItem.getId();
    }
}