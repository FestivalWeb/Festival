package org.zerock.backend.admin.dto.board;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardStatusUpdateRequest {
    // true: 사용, false: 중지
    private boolean status;
}