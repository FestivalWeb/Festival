package org.zerock.backend.admin.dto.popup;

import lombok.Builder;
import lombok.Getter;
import org.zerock.backend.entity.popup;
import org.zerock.backend.entity.popupschedule;

import java.time.LocalDateTime;
import java.util.Comparator;

@Getter
@Builder
public class PopupSummaryResponse {

    private Long popupId;
    private String title;
    private Long priority;
    private boolean status;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String imageUri;

    public static PopupSummaryResponse from(popup entity) {

        // 여러 schedule 중 하나만 쓸 거라고 가정 → startAt 기준 가장 이른 것 사용
        popupschedule schedule = entity.getSchedules().stream()
                .min(Comparator.comparing(popupschedule::getStartAt))
                .orElse(null);

        return PopupSummaryResponse.builder()
                .popupId(entity.getPopupId())
                .title(entity.getTitle())
                .priority(entity.getPriority())
                .status(entity.isStatus())
                .imageUri(entity.getImageUri())
                .startAt(schedule != null ? schedule.getStartAt() : null)
                .endAt(schedule != null ? schedule.getEndAt() : null)
                .build();
    }
}
