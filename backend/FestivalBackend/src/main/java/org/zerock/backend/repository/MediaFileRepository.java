package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.MediaFile;

public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {
}
