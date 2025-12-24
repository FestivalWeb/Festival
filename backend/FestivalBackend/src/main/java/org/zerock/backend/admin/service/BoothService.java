package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.booth.BoothDto;
import org.zerock.backend.admin.dto.booth.PostImageResponse; // Import 확인
import org.zerock.backend.entity.Booth;
import org.zerock.backend.repository.BoothRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BoothService {

    private final BoothRepository boothRepository;

    // 유저용 목록 조회 (공개된 것만)
    @Transactional(readOnly = true)
    public List<BoothDto.Response> getBoothList() {
        return boothRepository.findByIsShowTrueOrderByPriorityAscIdAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // 상세 조회
    @Transactional(readOnly = true)
    public BoothDto.Response getBoothDetail(Long id) {
        Booth booth = boothRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 부스입니다."));
        return toResponse(booth);
    }

    // [핵심 수정] DTO 변환 메서드
    private BoothDto.Response toResponse(Booth b) {
        
        List<PostImageResponse> images = b.getImages().stream()
                // ★ 중요: img는 BoothImage객체입니다. 파일 정보는 img.getMediaFile() 안에 있습니다.
                .map(img -> PostImageResponse.builder()
                        // 1. ID는 MediaFile 안에 있는 fileId를 가져와야 함
                        .fileId(img.getMediaFile().getFileId()) 
                        
                        // 2. fileName 필드가 없으므로, storageUri를 대신 넣어야 에러가 안 남
                        .storedName(img.getMediaFile().getStorageUri()) 
                        .originalName(img.getMediaFile().getStorageUri()) 
                        
                        // 3. 경로도 MediaFile 안에 있음
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
                .images(images) // 위에서 만든 리스트 넣기
                .isShow(b.isShow())
                .priority(b.getPriority())
                .build();
    }
}