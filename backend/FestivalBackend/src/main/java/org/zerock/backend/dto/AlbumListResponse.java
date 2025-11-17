package org.zerock.backend.dto; // (패키지 경로는 알맞게 수정하세요)

import lombok.Getter;
import org.zerock.backend.entity.GalleryAlbum;

@Getter
public class AlbumListResponse {

    private Long albumId;
    private String title;
    private String imageUrl; // 썸네일 이미지 URL

    // 썸네일이 없는 경우 기본 이미지
    private static final String DEFAULT_THUMBNAIL = "/images/default-thumbnail.png";

    public AlbumListResponse(GalleryAlbum album) {
        this.albumId = album.getId();
        this.title = album.getTitle();

        // 앨범에 coverFile이 있고, 그 파일에 storageUri가 있는지 확인
        if (album.getCoverFile() != null && album.getCoverFile().getStorageUri() != null) {
            this.imageUrl = album.getCoverFile().getStorageUri();
        } else {
            this.imageUrl = DEFAULT_THUMBNAIL;
        }
    }
}