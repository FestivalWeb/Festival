package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.PopupSchedule;

public interface PopupScheduleRepository extends JpaRepository<PopupSchedule, Long> {

}
