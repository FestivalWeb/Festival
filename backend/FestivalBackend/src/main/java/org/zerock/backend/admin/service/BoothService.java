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
        // findByIsShowTrue... 사용
        return boothRepository.findByIsShowTrueOrderByPriorityAscIdAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // 상세 조회 (공개된 것만 볼 수 있게 체크하거나, 그냥 둬도 무방)
    @Transactional(readOnly = true)
    public BoothDto.Response getBoothDetail(Long id) {
        Booth booth = boothRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 부스입니다."));
        
        // (선택) 비공개 부스는 유저가 URL로 접근해도 막고 싶다면:
        // if(!booth.isShow()) throw new IllegalArgumentException("준비 중인 부스입니다.");

        return toResponse(booth);
    }

    // DTO 변환 메서드 (기존 유지)
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
                .img(b.getImg())
                .images(images)
                .build();
    }
}