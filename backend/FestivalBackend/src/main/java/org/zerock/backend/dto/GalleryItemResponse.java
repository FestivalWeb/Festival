package org.zerock.backend.dto; // (패키지 경로는 알맞게 수정하세요)

import lombok.Getter;
import org.zerock.backend.entity.GalleryItem;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class GalleryItemResponse {

    private Long itemId;
    private String title;
    private String caption;
    private String location;
    private List<String> imageUrls; // 아이템 1개에 속한 이미지 URL 목록

    public GalleryItemResponse(GalleryItem item) {
        this.itemId = item.getId();
        this.title = item.getTitle();
        this.caption = item.getCaption();
        this.location = item.getLocation();

        // M:N 관계 (item.mediaMappings)에서 이미지 URL 목록(List<String>)을 추출
        this.imageUrls = item.getMediaMappings().stream()
                .map(mediaMapping -> mediaMapping.getMediaFile().getStorageUri())
                .collect(Collectors.toList());
    }
}