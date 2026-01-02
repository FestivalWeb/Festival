package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.board.DashboardStatsResponse;
import org.zerock.backend.repository.BoardRepository;
import org.zerock.backend.repository.NoticeRepository; // [추가]
import org.zerock.backend.repository.PostRepository;
import org.zerock.backend.repository.UserRepository;
import org.zerock.backend.repository.UserSessionRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final NoticeRepository noticeRepository; // [추가] 공지사항 리포지토리 주입
    private final UserSessionRepository userSessionRepository;

    public DashboardStatsResponse getStats() {
        long memberCount = userRepository.count();
        
        // [수정] 일반 게시글(Post) + 공지사항(Notice) 개수 합산
        long totalPosts = postRepository.count() + noticeRepository.count();

        long visitorCount = userSessionRepository.count(); 

        return DashboardStatsResponse.builder()
                .totalMembers(memberCount)
                .totalPosts(totalPosts) // 합산된 개수 전달
                .totalVisitors(visitorCount)
                .newReports(0)
                .build();
    }
}