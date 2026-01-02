package org.zerock.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostImageResponse {

    private Long fileId;        // media_file.file_id
    private String storageUri;  // 원본 파일 경로
    private String thumbUri;    // 썸네일 경로 (없으면 null)
    private String type;        // image/png, image/jpeg, video/mp4 ...
                                
    private Long sizeBytes;     // 파일 크기 
    private Long width;         // 가로(px) - MediaFile.weight
    private Long height;        // 세로(px)
    private Long durationSec;   // 영상일 경우 재생 시간(초)
}
