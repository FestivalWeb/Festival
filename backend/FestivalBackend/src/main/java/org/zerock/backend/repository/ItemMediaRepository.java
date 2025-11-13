package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.ItemMedia;
import org.zerock.backend.entity.ItemMediaId;

public interface ItemMediaRepository 
        extends JpaRepository<ItemMedia, ItemMediaId> {
}
