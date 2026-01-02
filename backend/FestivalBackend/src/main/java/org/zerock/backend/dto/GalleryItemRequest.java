package org.zerock.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
public class GalleryItemRequest {
    private String title;
    private String caption;
    private String location;
    private LocalDate takenDate; // 촬영일 (필요하다면)
    
    // 핵심: 미리 업로드된 파일들의 ID 리스트를 받습니다.
    private List<Long> fileIds; 
    
}