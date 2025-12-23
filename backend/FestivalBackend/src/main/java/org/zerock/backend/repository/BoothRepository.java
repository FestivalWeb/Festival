package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.Booth;
import java.util.List;

public interface BoothRepository extends JpaRepository<Booth, Long> {

    // 1. [검색용]
    List<Booth> findByTitleContainingOrLocationContainingOrContextContaining(String title, String location, String context);

    // 2. [목록 조회용] 
    // - status가 true인 것만 (공개)
    // - priority 오름차순 (1, 2, 3...)
    // - id 오름차순 (먼저 생성된 순)
    // [중요] 이 메서드 이름이 Service에서 호출하는 이름과 토씨 하나 안 틀리고 같아야 합니다.
    List<Booth> findByStatusTrueOrderByPriorityAscIdAsc();
    
}