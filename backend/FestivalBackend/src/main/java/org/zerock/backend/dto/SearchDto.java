package org.zerock.backend.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class SearchDto {
    private List<NoticeDto.Response> notices;      // 공지사항 결과
    private List<PostSummaryResponse> posts;       // 게시글 결과
    private List<BoothDto.Response> booths;        // 체험부스 결과
}