package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.Booth;
import java.util.List;

public interface BoothRepository extends JpaRepository<Booth, Long> {

    // 1. [검색용]
    List<Booth> findByTitleContainingOrLocationContainingOrContextContaining(String title, String location, String context);

    // 2. [사용자 목록 조회용] 공개 상태(ON)인 부스만 + 우선순위 순서대로 조회
    @EntityGraph(attributePaths = {"images"})
    List<Booth> findByStatusTrueOrderByPriorityAsc(); 

    // 3. [관리자 목록 조회용] 모든 부스 조회 + 우선순위 순서대로
    @EntityGraph(attributePaths = {"images"})
    List<Booth> findAllByOrderByPriorityAsc();
}