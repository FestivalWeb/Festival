package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.backend.entity.PostImgMapping;
import org.zerock.backend.entity.PostImgMappingId;

import java.util.List;

public interface PostImgMappingRepository extends JpaRepository<PostImgMapping, PostImgMappingId> {

    // 1) 특정 게시글(Post)에 달린 이미지 매핑 조회 (그대로 유지)
    List<PostImgMapping> findByPost_PostId(Long postId);

    // 2) 게시글 삭제 시 관련 이미지 매핑 일괄 삭제 (그대로 유지)
    @Modifying
    void deleteByPost_PostId(Long postId);

    // 3) [수정] 메서드 이름 변경 (MediaFile -> File)
    // 엔티티 필드명이 'file'이므로 'deleteByFile_FileId'가 맞습니다.
    @Modifying
    void deleteByFile_FileId(Long fileId);

    // 4) [수정] JPQL 쿼리 내 변수명 변경 (pim.mediaFile -> pim.file)
    @Query("SELECT pim FROM PostImgMapping pim " +
           "JOIN FETCH pim.file " +  // 여기가 수정됨!
           "WHERE pim.post.postId = :postId")
    List<PostImgMapping> findWithMediaFileByPostId(@Param("postId") Long postId);
}