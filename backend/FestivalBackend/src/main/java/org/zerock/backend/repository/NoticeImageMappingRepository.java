package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.NoticeImageMapping;
import org.zerock.backend.entity.NoticeImageId;

public interface NoticeImageMappingRepository 
        extends JpaRepository<NoticeImageMapping, NoticeImageId> {
}
