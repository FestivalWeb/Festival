package org.zerock.backend.admin.dto.popup;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PopupCreateRequest {

    @NotBlank
    private String title;

    private String content;

    private String imageUri;

    // null 이면 priority 1로 처리
    private Long priority;

    @NotNull
    private LocalDateTime startAt;

    @NotNull
    private LocalDateTime endAt;

    // true = 사용, false = 중지
    private boolean status = true;
}
