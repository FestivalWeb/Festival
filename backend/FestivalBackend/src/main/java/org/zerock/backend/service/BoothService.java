package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
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
public class BoothService {

    private final BoothRepository boothRepository;
    private final MediaFileRepository mediaFileRepository;

    // [갤러리 연동을 위한 Repository 주입]
    private final GalleryAlbumRepository galleryAlbumRepository;
    private final GalleryItemRepository galleryItemRepository;
    private final GalleryCategoryRepository galleryCategoryRepository;
    private final ItemMediaRepository itemMediaRepository;

    // 1. 부스 생성 (기존 코드 유지)
    public Long createBooth(BoothDto.CreateRequest request) {
        // 1) 부스 정보 저장
        Booth booth = Booth.builder()
                .title(request.getTitle())
                .context(request.getContext())
                .location(request.getLocation())
                .eventDate(request.getEventDate())
                .price(request.getPrice())
                .maxPerson(request.getMaxPerson())
                // [참고] DTO에 status, priority 필드가 있다면 여기서 set 해줘야 저장됩니다.
                // 현재 DTO에 없다면 엔티티 @PrePersist나 DB 기본값으로 들어갑니다.
                .build();
        Booth savedBooth = boothRepository.save(booth);

        // 2) 이미지가 있을 경우 처리
        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            List<MediaFile> files = mediaFileRepository.findAllById(request.getFileIds());
            
            // A. 부스 - 이미지 매핑
            for (MediaFile file : files) {
                BoothImageId id = BoothImageId.builder()
                        .boothId(savedBooth.getId())
                        .fileId(file.getFileId())
                        .build();

                BoothImage image = BoothImage.builder()
                        .id(id)
                        .booth(savedBooth)
                        .mediaFile(file)
                        .build();
                savedBooth.getImages().add(image);
            }

            // B. 갤러리 자동 등록 (기존 로직 유지)
            GalleryCategory category = galleryCategoryRepository.findByCode("BOOTH")
                    .orElseThrow(() -> new IllegalStateException("BOOTH 카테고리가 DB에 없습니다."));

            GalleryAlbum album = new GalleryAlbum();
            album.setCategory(category);
            album.setTitle(savedBooth.getTitle());
            album.setCoverFile(files.get(0));
            album.setVisibility(Visibility.PUBLIC);
            album.setActive(true);
            album.setCreatedBy(1L); 
            album.setCreateAt(LocalDateTime.now());
            album.setUpdatedAt(LocalDateTime.now());
            
            GalleryAlbum savedAlbum = galleryAlbumRepository.save(album);

            GalleryItem galleryItem = new GalleryItem();
            galleryItem.setAlbum(savedAlbum);
            galleryItem.setTitle(savedBooth.getTitle());
            galleryItem.setLocation(savedBooth.getLocation());
            galleryItem.setAdminId(1L);
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
        return savedBooth.getId();
    }

    // 2. 목록 조회 (사용자용 - 공개된 것만 + 우선순위 정렬)
    @Transactional(readOnly = true)
    public List<BoothDto.Response> getBoothList() {
        // [핵심 수정] findAll() -> findByStatusTrueOrderByPriorityAsc() 변경
        // 이렇게 해야 OFF인 부스는 안 보이고, 우선순위대로 정렬됩니다.
        return boothRepository.findByStatusTrueOrderByPriorityAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // 3. 상세 조회 (기존 유지)
    @Transactional(readOnly = true)
    public BoothDto.Response getBoothDetail(Long id) {
        Booth booth = boothRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 부스입니다."));
        return toResponse(booth);
    }

    private BoothDto.Response toResponse(Booth b) {
        List<PostImageResponse> images = b.getImages().stream()
                .filter(img -> img.getMediaFile() != null)
                .map(img -> PostImageResponse.builder()
                        .fileId(img.getMediaFile().getFileId())
                        .storageUri(img.getMediaFile().getStorageUri())
                        .build())
                .collect(Collectors.toList());

        return BoothDto.Response.builder()
                .id(b.getId())
                .title(b.getTitle())
                .context(b.getContext())
                .location(b.getLocation())
                .eventDate(b.getEventDate())
                .time(b.getTime())
                .price(b.getPrice())
                .maxPerson(b.getMaxPerson())
                .currentPerson(b.getCurrentPerson())
                .img(b.getImg())
                .images(images)
                .build();
    }
}