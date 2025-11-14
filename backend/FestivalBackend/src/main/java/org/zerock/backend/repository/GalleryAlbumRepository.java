package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.GalleryAlbum;
import org.zerock.backend.entity.Visibility;

import java.util.List;

public interface GalleryAlbumRepository extends JpaRepository<GalleryAlbum, Long> {
    List<GalleryAlbum> findByVisibilityAndActiveIsTrue(Visibility visibility);
}
