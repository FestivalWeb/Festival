package org.zerock.backend.admin.dto.booth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostImageResponse {
    
    // [수정] 기존 id -> fileId로 이름 변경!
    // BoothService에서 .fileId()로 호출하고 있기 때문입니다.
    private Long fileId; 
    
    private String originalName;
    private String storedName;
    private String storageUri; 
}