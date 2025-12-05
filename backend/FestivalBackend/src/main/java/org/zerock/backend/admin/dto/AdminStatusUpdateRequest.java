package org.zerock.backend.admin.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatusUpdateRequest {
    private boolean active;   // true면 활성화, false면 비활성화
}
