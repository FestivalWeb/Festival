package org.zerock.backend.admin.dto.board;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardStatsResponse {
    private long totalMembers;   // 총 회원 수
    private long totalPosts;     // 총 게시글 수
    private long totalVisitors;  // 총 방문자 수 (세션 기준 등)
    private long newReports;     // 신규 신고/문의 (임시)
}