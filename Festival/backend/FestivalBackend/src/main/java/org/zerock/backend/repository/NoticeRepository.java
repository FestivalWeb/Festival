package org.zerock.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.zerock.backend.entity.Notice;

import java.time.LocalDate;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    // 1) 키워드 검색 (제목+내용)
    List<Notice> findByTitleContainingOrContextContaining(String titleKeyword, String contentKeyword);

    // 2) 최신 순 전체 목록 (페이징)
    Page<Notice> findAllByOrderByCreatedDateDesc(Pageable pageable);

    // 3) 키워드 + 최신 순 페이징 검색
    Page<Notice> findByTitleContainingOrContextContainingOrderByCreatedDateDesc(
            String titleKeyword,
            String contentKeyword,
            Pageable pageable
    );

    // 4) 특정 관리자 작성 공지 (페이징)
    Page<Notice> findByAdminUser_AdminIdOrderByCreatedDateDesc(Long adminId, Pageable pageable);

    // 5) 조회수 기준 인기 공지 TOP N
    List<Notice> findByOrderByViewCountDescCreatedDateDesc(Pageable pageable);

    // 6) 조회수 증가 쿼리
    @Modifying
    @Query("update Notice n set n.viewCount = n.viewCount + 1 where n.noticeId = :id")
    void increaseViewCount(Long id);

    // 7) 기간별 공지 개수
    long countByCreatedDateBetween(LocalDate start, LocalDate end);
}