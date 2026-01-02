package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.dto.*;
import org.zerock.backend.entity.Booth;
import org.zerock.backend.entity.Notice;
import org.zerock.backend.repository.BoothRepository;
import org.zerock.backend.repository.NoticeRepository;
import org.zerock.backend.repository.PostRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchService {

    private final NoticeRepository noticeRepository;
    private final PostRepository postRepository;
    private final BoothRepository boothRepository;

    public SearchDto searchAll(String keyword) {
        // [안전 장치] 검색어 앞뒤 공백 제거
        String cleanKeyword = (keyword != null) ? keyword.trim() : "";
        
        System.out.println("### 통합 검색 시작. 키워드: [" + cleanKeyword + "]");

        // 1. 공지사항 검색
        List<Notice> noticeList = noticeRepository.findByTitleContainingOrContentContaining(cleanKeyword, cleanKeyword);
        List<NoticeDto.Response> notices = noticeList.stream()
                .map(n -> {
                    String writerName = (n.getAdminUser() != null) ? n.getAdminUser().getName() : "관리자";
                    
                    return NoticeDto.Response.builder()
                            .noticeId(n.getNoticeId())
                            .title(n.getTitle())
                            .content(n.getContent())
                            // [수정] 변수명 원복
                            .createDate(n.getCreateDate()) // regDate -> createDate
                            .viewCount(n.getViewCount())   // view -> viewCount
                            .writer(writerName)
                            .build();
                })
                .collect(Collectors.toList());
        // 2. 게시글 검색
        // [수정] PostSummaryResponse::from 메서드 참조 사용하여 깔끔하게 변환 (오류 해결)
        List<PostSummaryResponse> posts = postRepository.findByTitleContainingIgnoreCaseOrContextContainingIgnoreCase(
                cleanKeyword, cleanKeyword, org.springframework.data.domain.Pageable.unpaged()
        ).stream()
                .map(PostSummaryResponse::from)
                .collect(Collectors.toList());


        // 3. [수정] 체험부스 검색 (새로운 메서드 호출)
        // 제목, 위치, 내용 중 하나라도 키워드가 포함되면 찾아옵니다.
        List<Booth> boothList = boothRepository.findByTitleContainingOrLocationContainingOrContextContaining(
                cleanKeyword, cleanKeyword, cleanKeyword
        );
        
        System.out.println("### 부스 검색 결과 개수: " + boothList.size());

        List<BoothDto.Response> booths = boothList.stream()
                .map(b -> BoothDto.Response.builder()
                        .id(b.getId())
                        .title(b.getTitle())
                        .location(b.getLocation())
                        .img(b.getImg())
                        .build())
                .collect(Collectors.toList());

        return SearchDto.builder()
                .notices(notices)
                .posts(posts)
                .booths(booths)
                .build();
    }
}