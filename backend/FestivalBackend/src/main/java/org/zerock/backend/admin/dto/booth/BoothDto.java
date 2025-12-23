package org.zerock.backend.admin.dto.booth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

public class BoothDto {

    // 1. [요청용] 프론트엔드 -> 백엔드 (부스 생성/수정 할 때 보낼 데이터)
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        
        @NotBlank(message = "부스 이름은 필수입니다.")
        private String title;

        @NotBlank(message = "설명은 필수입니다.")
        private String context;

        @NotBlank(message = "위치는 필수입니다.")
        private String location;

        @NotNull(message = "운영 날짜는 필수입니다.")
        private LocalDate eventDate;

        @NotNull(message = "가격은 필수입니다.")
        private Long price;

        @NotNull(message = "최대 인원은 필수입니다.")
        private Long maxPerson;

        // 이미지 파일 ID 목록 (파일 업로드 후 받아온 ID들)
        private List<Long> fileIds; 
        
        // (선택) 우선순위도 입력받으려면 추가
        private Long priority;
    }

    // 2. [응답용] 백엔드 -> 프론트엔드 (화면에 뿌려줄 데이터)
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        
        private Long id;            // 부스 ID
        private String title;       // 이름
        private String context;     // 설명
        private String location;    // 위치
        private LocalDate eventDate;// 날짜
        private Long price;         // 가격
        private Long maxPerson;     // 최대 인원
        private String img;         // 대표 이미지 경로
        
        // 관리자용 정보 (유저한테는 필요 없지만, 관리자 페이지에선 필요함)
        private boolean isShow;     // 공개 여부
        private Long priority;      // 우선순위

        // 상세 이미지 리스트 (PostImageResponse는 기존에 있는 DTO 사용)
        private List<PostImageResponse> images;
    }
}