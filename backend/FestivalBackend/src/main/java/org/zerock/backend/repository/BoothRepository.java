package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.Booth;
import java.util.List;

public interface BoothRepository extends JpaRepository<Booth, Long> {
    
    // [유저용] 공개(isShow=true)된 것만 가져오기 (우선순위 높고, ID 빠른 순)
    List<Booth> findByIsShowTrueOrderByPriorityAscIdAsc();

    // [관리자용] findAll()은 이미 있으므로 생략 가능
}