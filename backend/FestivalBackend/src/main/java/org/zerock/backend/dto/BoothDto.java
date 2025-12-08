package org.zerock.backend.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

public class BoothDto {

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class CreateRequest {
        private String title;       // 부스 이름
        private String context;     // 설명
        private String location;    // 위치
        private LocalDate eventDate; // 날짜 (YYYY-MM-DD)
        private Long price;         // 가격
        private Long maxPerson;     // 최대 인원
        private List<Long> fileIds; // 추가 이미지 파일 ID들
    }

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Long id;
        private String title;
        private String context;
        private String location;
        private LocalDate eventDate;
        private Long price;
        private Long maxPerson;
        private String img; // 대표 이미지
        private List<PostImageResponse> images; // 추가 이미지 목록
    }
}