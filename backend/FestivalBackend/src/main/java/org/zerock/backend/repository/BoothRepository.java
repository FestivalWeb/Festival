package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.Booth;

public interface BoothRepository extends JpaRepository<Booth, Long> { }
