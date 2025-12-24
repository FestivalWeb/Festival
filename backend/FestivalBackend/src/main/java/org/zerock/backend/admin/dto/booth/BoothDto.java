package org.zerock.backend.admin.dto.booth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

public class BoothDto {

    // 1. [요청용] 프론트엔드가 보내는 데이터를 받는 그릇
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

        // [★여기가 핵심] 절대 List<Long>으로 쓰면 안 됨!
        // 프론트가 { ... } 객체를 보내니까 우리도 객체(PostImageResponse)로 받아야 함
        private List<PostImageResponse> fileIds;
    }

    // 2. [응답용] 백엔드가 프론트한테 보여줄 때 쓰는 그릇
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
        private boolean isShow;     
        private Long priority;      
        private List<PostImageResponse> images;
    }
}