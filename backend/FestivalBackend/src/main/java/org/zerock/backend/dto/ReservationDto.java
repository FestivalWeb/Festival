package org.zerock.backend.dto;

import lombok.*;
import java.time.LocalDate;

public class ReservationDto {

    @Getter @Setter
    public static class Request {
        private Long boothId;
        private String userId;
        private String reserveDate;
        private int count;
    }

    @Getter @Builder
    public static class Response {
        private Long reservationId;
        private String boothTitle;
        private String boothLocation;
        private LocalDate reserveDate;
        private int count;
        private String status;
        private String boothImg; // [추가] 썸네일 이미지 경로
    }
}