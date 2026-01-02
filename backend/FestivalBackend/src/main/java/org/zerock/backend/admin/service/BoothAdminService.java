package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.booth.BoothDto;
import org.zerock.backend.admin.dto.booth.PostImageResponse;
import org.zerock.backend.entity.*;
import org.zerock.backend.repository.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class BoothAdminService {

    private final BoothRepository boothRepository;
    
    // [갤러리 연동을 위한 Repository]
    private final MediaFileRepository mediaFileRepository;
    private final GalleryAlbumRepository galleryAlbumRepository;
    private final GalleryItemRepository galleryItemRepository;
    private final GalleryCategoryRepository galleryCategoryRepository;
    private final ItemMediaRepository itemMediaRepository;

    // 1. 목록 조회
    @Transactional(readOnly = true)
    public List<BoothDto.Response> getAllBooths() {
        // [중요] Repository 메서드 이름 수정됨 (findAllByOrderByPriorityAsc 사용)
        return boothRepository.findAllByOrderByPriorityAsc().stream()
                .map(this::toResponse) 
                .collect(Collectors.toList());
    }

    // 2. DTO 변환
    private BoothDto.Response toResponse(Booth b) {
        List<PostImageResponse> images = b.getImages().stream()
                .map(img -> PostImageResponse.builder()
                        .fileId(img.getMediaFile().getFileId())
                        .storedName(img.getMediaFile().getStorageUri())
                        // [수정 완료] getOriginalName() -> getStorageUri() (DB에 원본명 필드가 없으므로 경로로 대체)
                        .originalName(img.getMediaFile().getStorageUri()) 
                        .storageUri(img.getMediaFile().getStorageUri())
                        .build())
                .collect(Collectors.toList());

        return BoothDto.Response.builder()
                .id(b.getId())
                .title(b.getTitle())
                .context(b.getContext())
                .location(b.getLocation())
                .eventDate(b.getEventDate())
                .price(b.getPrice())
                .maxPerson(b.getMaxPerson())
                .img(b.getImg())
                .isShow(b.isShow())
                .priority(b.getPriority())
                .images(images)
                .build();
    }

    // 3. 부스 생성 (갤러리 자동 등록 포함)
    public Long createBooth(BoothDto.CreateRequest request, HttpServletRequest httpRequest) {
        Long adminId = (Long) httpRequest.getAttribute("loginAdminId");
        
        String mainImgUrl = "";
        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            mainImgUrl = request.getFileIds().get(0).getStorageUri();
        }

        // 1) 부스 저장
        Booth booth = Booth.builder()
                .title(request.getTitle())
                .context(request.getContext())
                .location(request.getLocation())
                .price(request.getPrice())
                .maxPerson(request.getMaxPerson())
                .eventDate(request.getEventDate())
                .status(false)
                .priority(request.getPriority() != null ? request.getPriority() : 1L)
                .img(mainImgUrl)
                .build();

        Booth savedBooth = boothRepository.save(booth);

        // 2) 이미지 연결 & 갤러리 등록
        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            
            List<Long> fileIdList = request.getFileIds().stream()
                    .map(PostImageResponse::getFileId)
                    .collect(Collectors.toList());
            List<MediaFile> files = mediaFileRepository.findAllById(fileIdList);

            // A. [기존] 부스에 이미지 연결
            for (MediaFile mediaFile : files) {
                 savedBooth.addImage(mediaFile); 
            }

            // B. [신규] 갤러리 자동 등록
            try {
                GalleryCategory category = galleryCategoryRepository.findByCode("BOOTH")
                        .orElseThrow(() -> new IllegalStateException("BOOTH 카테고리가 없습니다."));

                GalleryAlbum album = new GalleryAlbum();
                album.setCategory(category);
                album.setTitle(savedBooth.getTitle());
                album.setCoverFile(files.get(0));
                album.setVisibility(Visibility.PUBLIC);
                album.setActive(true);
                album.setCreatedBy(adminId != null ? adminId : 1L);
                album.setCreateAt(LocalDateTime.now());
                album.setUpdatedAt(LocalDateTime.now());
                
                GalleryAlbum savedAlbum = galleryAlbumRepository.save(album);

                GalleryItem galleryItem = new GalleryItem();
                galleryItem.setAlbum(savedAlbum);
                galleryItem.setTitle(savedBooth.getTitle());
                galleryItem.setLocation(savedBooth.getLocation());
                galleryItem.setAdminId(adminId != null ? adminId : 1L);
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
            } catch (Exception e) {
                log.error("갤러리 자동 등록 중 오류 발생: " + e.getMessage());
            }
        }
        return savedBooth.getId();
    }

    // 4. 수정
    public void updateBooth(Long id, BoothDto.CreateRequest request) {
         Booth booth = boothRepository.findById(id).orElseThrow();
         booth.updateInfo(request.getTitle(), request.getContext(), request.getLocation(), 
                          request.getPrice(), request.getMaxPerson(), request.getEventDate(), request.getPriority());
    }
    
    // 5. 상태 변경
    public void toggleStatus(Long id, boolean isShow) {
        Booth booth = boothRepository.findById(id).orElseThrow();
        booth.changeStatus(isShow);
    }
    
    // 6. 삭제
    public void deleteBooth(Long id) {
        boothRepository.deleteById(id);
    }
}