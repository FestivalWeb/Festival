package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.zerock.backend.dto.AlbumCreateRequest; // [새로 만든 DTO Import]
import org.zerock.backend.dto.AlbumDetailResponse;
import org.zerock.backend.dto.AlbumListResponse;
import org.zerock.backend.dto.GalleryItemRequest;
import org.zerock.backend.entity.GalleryCategory;
import org.zerock.backend.service.GalleryService;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryService galleryService;

    // ===========================
    //         조회 API
    // ===========================

    /**
     * 1. 앨범 목록 조회
     */
    @GetMapping("/albums")
    public ResponseEntity<Page<AlbumListResponse>> getGalleryAlbums(
            @RequestParam String categoryCode,
            @RequestParam(required = false) String searchKeyword,
            @PageableDefault(size = 4, sort = "createAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AlbumListResponse> albumPage = galleryService.getAlbumList(
                categoryCode,
                searchKeyword,
                pageable
        );
        return ResponseEntity.ok(albumPage);
    }

    /**
     * 2. 앨범 상세 조회
     */
    @GetMapping("/albums/{albumId}")
    public ResponseEntity<AlbumDetailResponse> getAlbumDetail(@PathVariable Long albumId) {
        AlbumDetailResponse albumDetail = galleryService.getAlbumDetails(albumId);
        return ResponseEntity.ok(albumDetail);
    }

    /**
     * 3. 카테고리 목록 조회 (앨범 생성 시 필요)
     */
    @GetMapping("/categories")
    public ResponseEntity<List<GalleryCategory>> getCategories() {
        return ResponseEntity.ok(galleryService.getCategories());
    }

    // ===========================
    //       관리자 전용 API
    // ===========================

    /**
     * 4. 앨범 생성 (관리자)
     */
    @PostMapping("/albums")
    public ResponseEntity<Long> createAlbum(
            @RequestBody AlbumCreateRequest request,
            HttpServletRequest httpRequest
    ) {
        // [보안] AdminSessionFilter가 검증 후 넣어준 관리자 ID 확인
        Long adminId = (Long) httpRequest.getAttribute("loginAdminId");
        if (adminId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long albumId = galleryService.createAlbum(
                request.getTitle(),
                request.getCategoryCode(),
                request.getCoverFileId(),
                adminId
        );
        return ResponseEntity.ok(albumId);
    }

    /**
     * 5. 앨범에 사진 추가 (관리자)
     */
    @PostMapping("/albums/{albumId}/items")
    public ResponseEntity<Long> createGalleryItem(
            @PathVariable Long albumId,
            @RequestBody GalleryItemRequest request,
            HttpServletRequest httpRequest
    ) {
        // [보안] 관리자 ID 확인
        Long adminId = (Long) httpRequest.getAttribute("loginAdminId");
        if (adminId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long itemId = galleryService.registerGalleryItem(albumId, adminId, request);
        return ResponseEntity.ok(itemId);
    }
}