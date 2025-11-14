package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.post;

public interface PostRepository extends JpaRepository<post, Long> {

}