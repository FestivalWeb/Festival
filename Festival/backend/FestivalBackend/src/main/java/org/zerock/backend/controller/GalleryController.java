package org.zerock.backend.controller; // (패키지 경로는 알맞게 수정하세요)

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.zerock.backend.dto.AlbumDetailResponse;
import org.zerock.backend.dto.AlbumListResponse;
import org.zerock.backend.service.GalleryService;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryService galleryService;

    /**
     * 1. 앨범 목록 조회 API (GET /api/gallery/albums)
     * (Image 1 - 체험부스 목록)
     */
    @GetMapping("/gallery/albums")
    public ResponseEntity<Page<AlbumListResponse>> getGalleryAlbums(
            
            @RequestParam String categoryCode, // 예: "booth"
            
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
     * 2. 앨범 상세 조회 API (GET /api/gallery/albums/{albumId})
     * (Image 3 - 체험부스_1 상세)
     */
    @GetMapping("/gallery/albums/{albumId}")
    public ResponseEntity<AlbumDetailResponse> getAlbumDetail(
            @PathVariable Long albumId
    ) {
        AlbumDetailResponse albumDetail = galleryService.getAlbumDetails(albumId);
        return ResponseEntity.ok(albumDetail);
    }
}