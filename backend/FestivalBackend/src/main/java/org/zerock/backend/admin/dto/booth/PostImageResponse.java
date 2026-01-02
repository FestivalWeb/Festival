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
    // 여기가 id면 안되고 fileId 여야 빌더에서 .fileId()를 쓸 수 있음
    private Long fileId; 
    
    private String originalName;
    private String storedName;
    private String storageUri; 
}