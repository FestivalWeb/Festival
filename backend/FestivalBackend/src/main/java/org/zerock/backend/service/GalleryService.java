package org.zerock.backend.service; // (패키지 경로는 알맞게 수정하세요)

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.zerock.backend.entity.GalleryAlbum;
import org.zerock.backend.entity.GalleryItem;
import org.zerock.backend.repository.GalleryAlbumRepository;
import org.zerock.backend.repository.GalleryItemRepository;
import org.zerock.backend.dto.AlbumDetailResponse;
import org.zerock.backend.dto.AlbumListResponse;
import org.zerock.backend.dto.GalleryItemResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@SuppressWarnings("null")
public class GalleryService {

    private final GalleryAlbumRepository galleryAlbumRepository;
    private final GalleryItemRepository galleryItemRepository;

    /**
     * 1. 앨범 목록 조회 (Image 2 -> Image 1)
     */
    public Page<AlbumListResponse> getAlbumList(String categoryCode, String searchKeyword, Pageable pageable) {

        // 1. 위에서 추가한 JPQL 쿼리 호출
        Page<GalleryAlbum> albumPage = galleryAlbumRepository.findAlbumsByCategoryAndKeyword(
                categoryCode, 
                searchKeyword, 
                pageable
        );

        // 2. Page<GalleryAlbum>을 Page<AlbumListResponse>로 변환하여 반환
        return albumPage.map(AlbumListResponse::new); // album -> new AlbumListResponse(album)
    }

    /**
     * 2. 앨범 상세 조회 (Image 1 -> Image 3)
     */
    public AlbumDetailResponse getAlbumDetails(Long albumId) {

        // 1. 앨범 정보 조회 (존재하지 않으면 예외 발생)
        GalleryAlbum album = galleryAlbumRepository.findById(albumId)
                .orElseThrow(() -> new EntityNotFoundException("앨범을 찾을 수 없습니다: " + albumId));

        // 2. 위에서 추가한 JPQL 쿼리 호출 (N+1 문제 해결됨)
        List<GalleryItem> items = galleryItemRepository.findItemsByAlbumIdWithMedia(albumId);

        // 3. List<GalleryItem>을 List<GalleryItemResponse>로 변환
        //    (이 과정에서 M:N 관계의 이미지 URL 목록이 DTO에 채워짐)
        List<GalleryItemResponse> itemResponses = items.stream()
                .map(GalleryItemResponse::new)
                .collect(Collectors.toList());

        // 4. 최종 DTO로 조립하여 반환
        return new AlbumDetailResponse(album, itemResponses);
    }
}