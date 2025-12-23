package org.zerock.backend.admin.dto.board;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardUpdateRequest {

    @NotBlank
    @Size(max = 100)
    private String name;

    // [삭제] private String visibility;
    // [추가]
    private String readRole;
    private String writeRole;

    private boolean status;

    @NotBlank
    @Size(max = 50)
    private String skin;
}