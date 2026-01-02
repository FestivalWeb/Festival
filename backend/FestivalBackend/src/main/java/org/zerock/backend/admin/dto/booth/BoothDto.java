package org.zerock.backend.admin.dto.booth;

import com.fasterxml.jackson.annotation.JsonProperty; // [핵심]
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

public class BoothDto {

    // 1. [요청용]
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
        
        private Long priority;

        // 이미지 파일 정보 리스트
        private List<PostImageResponse> fileIds;
    }

    // 2. [응답용]
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String title;
        private String context;
        private String location;
        private LocalDate eventDate;
        private Long price;
        private Long maxPerson;
        private String img;

        // [★중요] JSON 변환 시 이름을 'isShow'로 고정
        @JsonProperty("isShow")
        private boolean isShow; 
        
        private Long priority;
        private List<PostImageResponse> images;
    }
}