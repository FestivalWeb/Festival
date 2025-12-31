package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.board.DashboardStatsResponse;
import org.zerock.backend.repository.BoardRepository; // [추가]
import org.zerock.backend.repository.PostRepository;
import org.zerock.backend.repository.UserRepository;
import org.zerock.backend.repository.UserSessionRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final BoardRepository boardRepository; // [추가] 게시판 개수 확인용
    private final UserSessionRepository userSessionRepository;

    public DashboardStatsResponse getStats() {
        long memberCount = userRepository.count();
        
        // [수정] 게시글(Post) 수가 아니라 게시판(Board) 수를 보여주고 싶다면 아래처럼 변경하세요.
        // long postCount = postRepository.count(); // 기존: 게시글 수 (0개)
        long boardCount = boardRepository.count();  // 변경: 게시판 수 (2개)

        long visitorCount = userSessionRepository.count(); 

        return DashboardStatsResponse.builder()
                .totalMembers(memberCount)
                .totalPosts(boardCount) // DTO 필드명은 totalPosts지만 값은 게시판 수를 넣음
                .totalVisitors(visitorCount)
                .newReports(0)
                .build();
    }
}