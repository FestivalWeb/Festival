package org.zerock.backend.dto; // (패키지 경로는 알맞게 수정하세요)

import lombok.Getter;
import org.zerock.backend.entity.GalleryAlbum;
import java.util.List;

@Getter
public class AlbumDetailResponse {

    private Long albumId;
    private String albumTitle;
    private List<GalleryItemResponse> items; // 앨범에 속한 아이템 목록

    public AlbumDetailResponse(GalleryAlbum album, List<GalleryItemResponse> items) {
        this.albumId = album.getId();
        this.albumTitle = album.getTitle();
        this.items = items;
    }
}