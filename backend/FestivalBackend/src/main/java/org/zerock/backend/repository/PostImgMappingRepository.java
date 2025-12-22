package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.backend.entity.PostImgMapping;
import org.zerock.backend.entity.PostImgMappingId;
import org.zerock.backend.entity.post; // [필수] post 엔티티 임포트

import java.util.List;

public interface PostImgMappingRepository extends JpaRepository<PostImgMapping, PostImgMappingId> {

    // 1) 특정 게시글(Post)에 달린 이미지 매핑 조회
    List<PostImgMapping> findByPost_PostId(Long postId);

    // 2) 게시글 삭제 시 관련 이미지 매핑 일괄 삭제 (ID 기준)
    @Modifying
    void deleteByPost_PostId(Long postId);

    // [핵심 추가] Service에서 호출하는 '엔티티 기준 삭제' 메서드 추가
    void deleteByPost(post post);

    // 3) 파일 ID로 삭제
    @Modifying
    void deleteByFile_FileId(Long fileId);

    // 4) JPQL 쿼리 (이미지 파일 정보까지 한 번에 가져오기)
    @Query("SELECT pim FROM PostImgMapping pim " +
           "JOIN FETCH pim.file " + 
           "WHERE pim.post.postId = :postId")
    List<PostImgMapping> findWithMediaFileByPostId(@Param("postId") Long postId);
}