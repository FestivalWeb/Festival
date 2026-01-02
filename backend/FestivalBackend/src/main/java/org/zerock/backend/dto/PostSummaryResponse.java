package org.zerock.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.zerock.backend.entity.Post;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostSummaryResponse {

    private Long postId;
    private String title;
    
    // [원복] 프론트엔드가 'userId'를 찾으므로 이름 유지
    private String userId; 
    
    // [원복] 'viewCount' -> 'view'
    private Long view;

    // [날짜 포맷 유지]
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createDate;

    // [원복] 첨부파일 아이콘 표시 조건용 필드
    private Long thumbnailFileId;
    
    // [원복] 'thumbUrl' -> 'thumbnailUri'
    private String thumbnailUri;

    // Entity -> DTO 변환 메서드
    public static PostSummaryResponse from(Post post) {
        // 1. 작성자 ID 가져오기 (관리자/일반회원 구분하여 에러 방지)
        String writerId = "알 수 없음";
        if (post.getUser() != null) {
            // 기존 코드처럼 userId를 반환 (필요시 getNickname()으로 변경 가능)
            writerId = post.getUser().getUserId(); 
        } else if (post.getAdminUser() != null) {
            writerId = post.getAdminUser().getName(); // 관리자는 이름 표시
        }

        // 2. 썸네일/파일 정보 처리
        Long fileId = null;
        String uri = null;
        
        if (post.getImages() != null && !post.getImages().isEmpty()) {
            var firstImg = post.getImages().iterator().next();
            if (firstImg.getFile() != null) {
                fileId = firstImg.getFile().getFileId();
                // 썸네일이 있으면 썸네일, 없으면 원본
                uri = (firstImg.getFile().getThumbUri() != null) 
                        ? firstImg.getFile().getThumbUri() 
                        : firstImg.getFile().getStorageUri();
            }
        }

        return PostSummaryResponse.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .userId(writerId)    // [원복] 필드명 일치
                .view(post.getView()) // [원복] 필드명 일치
                .createDate(post.getCreateDate())
                .thumbnailFileId(fileId) // [원복] 아이콘 표시용
                .thumbnailUri(uri)       // [원복] 이미지 경로
                .build();
    }
}