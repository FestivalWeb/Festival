package org.zerock.backend.admin.dto.popup;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PopupBulkDeleteRequest {

    private List<Long> popupIds;
}
