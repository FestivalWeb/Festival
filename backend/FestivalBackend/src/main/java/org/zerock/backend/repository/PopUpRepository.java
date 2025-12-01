package org.zerock.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.popup;

import java.util.List;

public interface PopUpRepository extends JpaRepository<popup, Long> {

    // 우선순위, popupId 등으로 정렬해서 조회
    List<popup> findAllByOrderByPriorityAscPopupIdAsc();
}
