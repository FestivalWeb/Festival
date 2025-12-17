package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.Booth;
import java.util.List;

public interface BoothRepository extends JpaRepository<Booth, Long> {

    // [수정] @Query 삭제 -> Spring Data JPA 자동 생성 메서드 사용 (가장 안전함)
    // 제목(Title) 포함 OR 위치(Location) 포함 OR 내용(Context) 포함
    List<Booth> findByTitleContainingOrLocationContainingOrContextContaining(String title, String location, String context);
}