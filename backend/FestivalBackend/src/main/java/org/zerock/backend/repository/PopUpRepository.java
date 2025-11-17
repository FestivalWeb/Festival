package org.zerock.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.popup;

public interface PopUpRepository extends JpaRepository<popup, Long> {

}
