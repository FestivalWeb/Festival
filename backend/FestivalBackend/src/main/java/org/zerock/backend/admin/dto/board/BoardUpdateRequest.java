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

    @NotBlank
    @Size(max = 7)
    private String visibility;

    private boolean status;

    @NotBlank
    @Size(max = 50)
    private String skin;
}