package org.zerock.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.Popup;

public interface PopUpRepository extends JpaRepository<Popup, Long> {

}
