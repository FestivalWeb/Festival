package org.zerock.backend.admin.dto.popup;

import lombok.Builder;
import lombok.Getter;
import org.zerock.backend.entity.Popup;
import org.zerock.backend.entity.PopupSchedule;

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

    public static PopupSummaryResponse from(Popup entity) {

        // 여러 schedule 중 하나만 쓸 거라고 가정 → startAt 기준 가장 이른 것 사용
        PopupSchedule schedule = entity.getSchedules().stream()
                .min(Comparator.comparing(PopupSchedule::getStartAt))
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
