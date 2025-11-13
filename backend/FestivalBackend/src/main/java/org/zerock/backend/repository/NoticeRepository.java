package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.Notice;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
}