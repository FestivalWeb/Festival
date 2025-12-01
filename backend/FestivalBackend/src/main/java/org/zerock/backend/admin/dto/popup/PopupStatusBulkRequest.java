package org.zerock.backend.admin.dto.popup;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PopupStatusBulkRequest {

    // 상태를 바꿀 팝업 ID 목록
    private List<Long> popupIds;

    // 바꿀 상태 값 (true = 사용, false = 중지)
    private boolean status;
}
