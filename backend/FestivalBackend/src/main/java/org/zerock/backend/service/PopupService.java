package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.dto.PopupDto;
import org.zerock.backend.entity.*;
import org.zerock.backend.repository.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class PopupService {

    private final PopUpRepository popUpRepository;
    private final MediaFileRepository mediaFileRepository;

    // 1. 팝업 생성 (관리자)
    public Long createPopup(PopupDto.CreateRequest request) {
        String imageUri = null;
        if (request.getFileId() != null) {
            MediaFile file = mediaFileRepository.findById(request.getFileId()).orElse(null);
            if (file != null) imageUri = file.getStorageUri();
        }

        Popup popup = Popup.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .imageUri(imageUri)
                .priority(request.getPriority())
                .build();

        // 스케줄 설정
        PopupSchedule schedule = PopupSchedule.builder()
                .popUp(popup)
                .startAt(request.getStartAt())
                .endAt(request.getEndAt())
                .build();
        popup.getSchedules().add(schedule);

        return popUpRepository.save(popup).getPopupId();
    }

    // 2. 현재 활성화된 팝업 조회 (메인페이지용)
    @Transactional(readOnly = true)
    public List<PopupDto.Response> getActivePopups() {
        return popUpRepository.findActivePopups(LocalDateTime.now()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private PopupDto.Response toResponse(Popup p) {
        // 첫 번째 스케줄 정보만 가져옴 (단순화)
        LocalDateTime start = null, end = null;
        if (!p.getSchedules().isEmpty()) {
            start = p.getSchedules().get(0).getStartAt();
            end = p.getSchedules().get(0).getEndAt();
        }

        return PopupDto.Response.builder()
                .popupId(p.getPopupId())
                .title(p.getTitle())
                .content(p.getContent())
                .imageUri(p.getImageUri())
                .priority(p.getPriority())
                .startAt(start)
                .endAt(end)
                .build();
    }
}