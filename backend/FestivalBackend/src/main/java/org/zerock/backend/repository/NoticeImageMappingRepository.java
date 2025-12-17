package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.zerock.backend.entity.NoticeImageMapping;
import org.zerock.backend.entity.NoticeImageId;

import java.util.List;

public interface NoticeImageMappingRepository extends JpaRepository<NoticeImageMapping, NoticeImageId> {

    // 1) 특정 공지에 연결된 이미지 매핑 전부 조회
    List<NoticeImageMapping> findByNotice_NoticeId(Long noticeId);

    // 2) 특정 파일이 어떤 공지들에 쓰이는지 조회
    List<NoticeImageMapping> findByMediaFile_FileId(Long fileId);

    // 3) 공지에 달린 이미지 매핑 전부 삭제 (공지 이미지 전체 교체시 사용)
    @Modifying
    void deleteByNotice_NoticeId(Long noticeId);

    // 4) 특정 파일이 연결된 모든 매핑 삭제
    @Modifying
    void deleteByMediaFile_FileId(Long fileId);

    // 5) 특정 공지에서 특정 이미지 한 개만 떼기
    @Modifying
    void deleteByNotice_NoticeIdAndMediaFile_FileId(Long noticeId, Long fileId);

    // 6) 공지에 연결된 이미지 수 카운트
    long countByNotice_NoticeId(Long noticeId);

    // 7) 공지 기준으로 이미지 + MediaFile까지 한 번에 가져오기 (fetch join 예시)
    @Query("select nim from NoticeImageMapping nim join fetch nim.mediaFile where nim.notice.noticeId = :noticeId")
    List<NoticeImageMapping> findWithMediaFileByNoticeId(Long noticeId);
}