package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.PostImgMapping;
import org.zerock.backend.entity.PostImgMappingId;

public interface PostImgMappingRepository extends JpaRepository<PostImgMapping, PostImgMappingId> {

}