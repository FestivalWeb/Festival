package org.zerock.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostImgMappingId implements Serializable {
    // 복합 키 클래스는 반드시 Serializable을 구현해야 합니다.
    
    private Long post; // PostImgMapping의 필드명과 똑같아야 함
    private Long file; // PostImgMapping의 필드명과 똑같아야 함
}