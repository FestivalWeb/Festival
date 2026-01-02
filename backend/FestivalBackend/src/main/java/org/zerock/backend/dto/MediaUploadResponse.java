package org.zerock.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MediaUploadResponse {

    private Long fileId;
    private String url;
    private String thumbUrl;
}