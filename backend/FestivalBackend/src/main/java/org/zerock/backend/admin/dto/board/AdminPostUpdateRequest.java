package org.zerock.backend.admin.dto.board;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AdminPostUpdateRequest {

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;

    private boolean important; // 중요도 수정 가능

    private List<Long> fileIds; // 파일 수정 (추가/삭제 로직 필요 시)
}