package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.booth.BoothDto;
import org.zerock.backend.admin.dto.booth.PostImageResponse; // import 확인
import org.zerock.backend.entity.Booth;
import org.zerock.backend.entity.MediaFile;
import org.zerock.backend.repository.BoothRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class BoothAdminService {

    private final BoothRepository boothRepository;

    // [★수정] 반환 타입을 DTO 리스트로 변경 (무한루프 방지)
    @Transactional(readOnly = true)
    public List<BoothDto.Response> getAllBooths() {
        return boothRepository.findAll().stream()
                .map(this::toResponse) // 엔티티 -> DTO 변환
                .collect(Collectors.toList());
    }

    // [★추가] 변환 메서드 (이게 있어야 무한루프 안 걸림)
    private BoothDto.Response toResponse(Booth b) {
        List<PostImageResponse> images = b.getImages().stream()
                .map(img -> PostImageResponse.builder()
                        .fileId(img.getMediaFile().getFileId())
                        .storedName(img.getMediaFile().getStorageUri())
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

    // --- (아래 createBooth 등 다른 메서드는 기존 코드 유지) ---
    // 아까 수정한 createBooth 그대로 두세요.
    public Long createBooth(BoothDto.CreateRequest request, HttpServletRequest httpRequest) {
        Long adminId = (Long) httpRequest.getAttribute("loginAdminId");
        String mainImgUrl = "";
        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            mainImgUrl = request.getFileIds().get(0).getStorageUri();
        }

        Booth booth = Booth.builder()
                .title(request.getTitle())
                .context(request.getContext())
                .location(request.getLocation())
                .price(request.getPrice()) 
                .maxPerson(request.getMaxPerson())
                .eventDate(request.getEventDate())
                .isShow(false) 
                .priority(request.getPriority() != null ? request.getPriority() : 1L)
                .createdBy(adminId)
                .img(mainImgUrl)
                .build();

        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            request.getFileIds().forEach(imgDto -> {
                MediaFile mediaFile = MediaFile.builder()
                        .storageUri(imgDto.getStorageUri())
                        .type("image/jpeg") 
                        .thumbUri(imgDto.getStorageUri())
                        .build();
                booth.addImage(mediaFile);
            });
        }
        return boothRepository.save(booth).getId();
    }

    public void updateBooth(Long id, BoothDto.CreateRequest request) {
         Booth booth = boothRepository.findById(id).orElseThrow();
         booth.updateInfo(request.getTitle(), request.getContext(), request.getLocation(), 
                          request.getPrice(), request.getMaxPerson(), request.getEventDate(), request.getPriority());
    }
    
    public void toggleStatus(Long id, boolean isShow) {
        Booth booth = boothRepository.findById(id).orElseThrow();
        booth.changeStatus(isShow);
    }
    
    public void deleteBooth(Long id) {
        boothRepository.deleteById(id);
    }
}