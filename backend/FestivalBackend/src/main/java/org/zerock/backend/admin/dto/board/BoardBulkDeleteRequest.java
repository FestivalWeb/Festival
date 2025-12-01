package org.zerock.backend.admin.dto.board;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BoardBulkDeleteRequest {

    // 삭제할 boardId 목록
    private List<Long> boardIds;
}
