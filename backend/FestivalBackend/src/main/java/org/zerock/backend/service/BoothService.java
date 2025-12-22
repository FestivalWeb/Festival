package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
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
public class BoothService {

    private final BoothRepository boothRepository;
    private final MediaFileRepository mediaFileRepository;

    // 1. 부스 생성
    public Long createBooth(BoothDto.CreateRequest request) {
        Booth booth = Booth.builder()
                .title(request.getTitle())
                .context(request.getContext())
                .location(request.getLocation())
                .eventDate(request.getEventDate())
                .price(request.getPrice())
                .maxPerson(request.getMaxPerson())
                .build();

        Booth savedBooth = boothRepository.save(booth);

        // 이미지 저장
        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            List<MediaFile> files = mediaFileRepository.findAllById(request.getFileIds());
            for (MediaFile file : files) {
                // 복합키 생성
                BoothImageId id = BoothImageId.builder()
                        .boothId(savedBooth.getId())
                        .fileId(file.getFileId())
                        .build();

                // 엔티티 생성
                BoothImage image = BoothImage.builder()
                        .id(id)
                        .booth(savedBooth)
                        .mediaFile(file) // [주의] BoothImage 엔티티 필드명이 mediaFile임
                        .build();
                
                savedBooth.getImages().add(image);
            }
        }
        return savedBooth.getId();
    }

    // 2. 목록 조회
    @Transactional(readOnly = true)
    public List<BoothDto.Response> getBoothList() {
        // (선택사항) 만약 '공개된(status=true) 부스'만 보여주고 싶다면 findAll() 대신 이걸 쓰세요.
        // return boothRepository.findByStatusTrueOrderByIdAsc().stream() ...
        
        return boothRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // 3. 상세 조회
    @Transactional(readOnly = true)
    public BoothDto.Response getBoothDetail(Long id) {
        Booth booth = boothRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 부스입니다."));
        return toResponse(booth);
    }

    // DTO 변환
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