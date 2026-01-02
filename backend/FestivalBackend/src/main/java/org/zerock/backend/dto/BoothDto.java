package org.zerock.backend.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

public class BoothDto {

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class CreateRequest {
        private String title;
        private String context;
        private String location;
        private LocalDate eventDate;
        private String time; // [추가]
        private Long price;
        private Long maxPerson;
        private List<Long> fileIds;
    }

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Long id;
        private String title;
        private String context;
        private String location;
        private LocalDate eventDate;
        private String time;          // [추가] 운영 시간
        private Long price;
        private Long maxPerson;
        private Long currentPerson;   // [추가] 현재 예약 인원 
        private String img;
        private List<PostImageResponse> images;
    }
}