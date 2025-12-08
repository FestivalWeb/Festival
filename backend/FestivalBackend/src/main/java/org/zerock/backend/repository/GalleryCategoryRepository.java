package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.GalleryCategory;

import java.util.Optional;

public interface GalleryCategoryRepository extends JpaRepository<GalleryCategory, Long> {
    Optional<GalleryCategory> findByCode(String code);
}