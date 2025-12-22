package org.zerock.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.zerock.backend.entity.MediaFile;

import java.util.List;
import java.util.Optional;

public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {

    // 1) 파일 경로로 단일 조회
    Optional<MediaFile> findByStorageUri(String storageUri);

    // 2) 정확한 타입 조회 (예: image/png)
    List<MediaFile> findByType(String type);

    // 3) 타입 prefix로 검색 (예: image, video)
    Page<MediaFile> findByTypeStartingWith(String typePrefix, Pageable pageable);

    // 4) 파일 용량 이상 조회
    List<MediaFile> findBySizeBytesGreaterThan(Long minSize);

    // 5) 파일 용량 이하 조회
    List<MediaFile> findBySizeBytesLessThan(Long maxSize);

    // 6) 용량 기준 내림차순 정렬 → 대용량 파일 조회
    Page<MediaFile> findAllByOrderBySizeBytesDesc(Pageable pageable);

    // 7) 생성일 기준 정렬 (id로 대체)
    Page<MediaFile> findAllByOrderByFileIdDesc(Pageable pageable);

    // 8) 파일명 기반 검색 (URI에 포함된 검색어)
    List<MediaFile> findByStorageUriContaining(String keyword);

    // 9) 확장자 기반 검색 (예: png, jpg)
    @Query("select m from MediaFile m where m.storageUri like %:ext")
    List<MediaFile> findByExtension(String ext);

    // 10) 이미지 타입만 조회
    @Query("select m from MediaFile m where m.type like 'image%'")
    Page<MediaFile> findImageFiles(Pageable pageable);

    // 11) 비디오 타입만 조회
    @Query("select m from MediaFile m where m.type like 'video%'")
    Page<MediaFile> findVideoFiles(Pageable pageable);

    // 12) 오래된 파일 TOP N (id 오름차순)
    Page<MediaFile> findAllByOrderByFileIdAsc(Pageable pageable);

    // 13) 썸네일 변경
    @Modifying
    @Query("update MediaFile m set m.thumbUri = :thumbUri where m.fileId = :fileId")
    void updateThumbUri(Long fileId, String thumbUri);

    List<MediaFile> findByPostIsNotNullOrderByFileIdDesc();

}
