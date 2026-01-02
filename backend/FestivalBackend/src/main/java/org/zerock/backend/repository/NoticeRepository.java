package org.zerock.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.backend.entity.Notice;

import java.time.LocalDateTime;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    // 1) 키워드 검색 (제목+내용)
    List<Notice> findByTitleContainingOrContentContaining(String titleKeyword, String contentKeyword);

    // 2) 최신 순 전체 목록 (페이징)
    Page<Notice> findAllByOrderByCreateDateDesc(Pageable pageable);

    // 3) 키워드 + 최신 순 페이징 검색
    Page<Notice> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            String titleKeyword, 
            String contentKeyword, 
            Pageable pageable
    );

    // 4) 특정 관리자 작성 공지 (페이징)
    Page<Notice> findByAdminUser_AdminIdOrderByCreateDateDesc(Long adminId, Pageable pageable);

    // 5) 조회수 기준 인기 공지 TOP N
    List<Notice> findByOrderByViewCountDescCreateDateDesc(Pageable pageable);

    // 6) 조회수 증가 쿼리
    // [핵심 수정] clearAutomatically = true 추가 (업데이트 후 영속성 컨텍스트 초기화 -> 최신값 조회 보장)
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Notice n SET n.viewCount = n.viewCount + 1 WHERE n.noticeId = :noticeId")
    void increaseViewCount(@Param("noticeId") Long noticeId);

    // 7) 기간별 공지 개수
    long countByCreateDateBetween(LocalDateTime start, LocalDateTime end);
}