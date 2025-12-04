package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.PopupSchedule;

import java.util.List;

public interface PopupScheduleRepository extends JpaRepository<PopupSchedule, Long> {

    // 특정 팝업에 걸려있는 스케줄 목록 조회
    // Entity 필드명이 'popUp'이므로 findByPopUp_PopupId 권장
    List<PopupSchedule> findByPopUp_PopupId(Long popupId);
}