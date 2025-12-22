package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.Booth;
import java.util.List;

public interface BoothRepository extends JpaRepository<Booth, Long> {

    // [검색용] 제목, 위치, 내용 중 하나라도 포함되면 찾기
    List<Booth> findByTitleContainingOrLocationContainingOrContextContaining(String title, String location, String context);

    // ▼▼▼ [수정] 이 부분이 핵심입니다! ▼▼▼
    // 기존: findByIsShowTrueOrderByPriorityAscIdAsc() -> 에러 발생 (isShow, priority 없음)
    // 변경: findByStatusTrueOrderByIdAsc() -> 정상 작동 (status, id 있음)
    List<Booth> findByStatusTrueOrderByIdAsc();
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
}