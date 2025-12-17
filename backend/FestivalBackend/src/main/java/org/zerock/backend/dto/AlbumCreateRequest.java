package org.zerock.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AlbumCreateRequest {
    private String title;       // 앨범 제목
    private String categoryCode;// 카테고리 (예: "booth", "concert")
    private Long coverFileId;   // 앨범 커버 사진 ID (선택 사항)
}