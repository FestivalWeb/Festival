package org.zerock.backend.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostUpdateRequest {

    private String title;
    private String context;
    private List<Long> fileIds;  //새로 적용할 이미지 file_id 목록
}
