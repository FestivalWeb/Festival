package org.zerock.backend.admin.dto.board;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardCreateRequest {

    @NotBlank
    @Size(max = 100)
    private String name;          // 게시판명

    // [삭제] private String visibility;
    // [추가]
    private String readRole;
    private String writeRole;

    // true = 사용, false = 중지
    private boolean status = true;

    @NotBlank
    @Size(max = 50)
    private String skin;          // basic, gallery, event
}