package org.zerock.backend.admin.dto.board;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class AdminPostCreateRequest {

    @NotNull(message = "게시판 ID는 필수입니다.")
    private Long boardId;  // ★ 핵심: 어느 게시판에 쓸지 지정 (1=공지, 2=자유 등)

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;

    private boolean important; // 상단 고정 여부 (공지사항인 경우 사용)

    // 첨부파일 ID 목록 (기존 NoticeService 로직 유지용)
    private List<Long> fileIds; 
}