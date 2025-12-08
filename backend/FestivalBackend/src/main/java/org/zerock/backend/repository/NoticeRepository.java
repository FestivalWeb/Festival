package org.zerock.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.backend.entity.Notice;

import java.time.LocalDateTime; // LocalDate 대신 LocalDateTime 사용 (엔티티 타입 맞춤)
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    // 1) 키워드 검색 (제목+내용)
    // [수정] Context -> Content
    List<Notice> findByTitleContainingOrContentContaining(String titleKeyword, String contentKeyword);

    // 2) 최신 순 전체 목록 (페이징)
    // [수정] CreatedDate -> CreateDate
    Page<Notice> findAllByOrderByCreateDateDesc(Pageable pageable);

    // 3) 키워드 + 최신 순 페이징 검색
    // [수정] Context -> Content, CreatedDate -> CreateDate
    Page<Notice> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            String titleKeyword, 
            String contentKeyword, 
            Pageable pageable
    );

    // 4) 특정 관리자 작성 공지 (페이징)
    // [수정] CreatedDate -> CreateDate
    Page<Notice> findByAdminUser_AdminIdOrderByCreateDateDesc(Long adminId, Pageable pageable);

    // 5) 조회수 기준 인기 공지 TOP N
    // [수정] CreatedDate -> CreateDate
    List<Notice> findByOrderByViewCountDescCreateDateDesc(Pageable pageable);

    // 6) 조회수 증가 쿼리
    @Modifying
    @Query("UPDATE Notice n SET n.viewCount = n.viewCount + 1 WHERE n.noticeId = :noticeId")
    void increaseViewCount(@Param("noticeId") Long noticeId);

    // 7) 기간별 공지 개수
    // [수정] CreatedDate -> CreateDate, 파라미터 타입 LocalDateTime으로 변경
    long countByCreateDateBetween(LocalDateTime start, LocalDateTime end);
}