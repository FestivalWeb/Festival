package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.booth.BoothDto;
import org.zerock.backend.admin.dto.booth.PostImageResponse;
import org.zerock.backend.entity.Booth;
import org.zerock.backend.repository.BoothRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BoothService {

    private final BoothRepository boothRepository;

    // [수정] 유저용 목록 조회: 공개된 것만 리턴
    @Transactional(readOnly = true)
    public List<BoothDto.Response> getBoothList() {
        // [핵심 수정] findByIsShowTrue... -> findByStatusTrue... (필드명이 status이므로)
        return boothRepository.findByStatusTrueOrderByPriorityAscIdAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // 상세 조회
    @Transactional(readOnly = true)
    public BoothDto.Response getBoothDetail(Long id) {
        Booth booth = boothRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 부스입니다."));
        
        // (선택) 만약 엔티티에 isShow() 메서드를 만들어뒀다면 아래처럼 사용 가능
        // if(!booth.isShow()) throw new IllegalArgumentException("준비 중인 부스입니다.");

        return toResponse(booth);
    }

    // DTO 변환 메서드
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
                .price(b.getPrice())
                .maxPerson(b.getMaxPerson())
                // .img(b.getImg()) // [주의] Booth 엔티티에 img 필드가 없다면 이 줄은 삭제하거나 getImages()에서 대표 이미지를 뽑아야 함
                .images(images)
                .build();
    }
}