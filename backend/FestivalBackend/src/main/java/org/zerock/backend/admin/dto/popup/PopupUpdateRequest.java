package org.zerock.backend.admin.dto.popup;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PopupUpdateRequest {

    @NotBlank
    private String title;

    private String content;

    private String imageUri;

    private Long priority;

    @NotNull
    private LocalDateTime startAt;

    @NotNull
    private LocalDateTime endAt;

    private boolean status;

    private List<Long> fileIds;
}
