package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;
import org.zerock.backend.entity.UserSessionEntity;

public interface UserSessionRepository extends JpaRepository<UserSessionEntity, String> {

    @Modifying
    @Transactional
    @Query("DELETE FROM UserSessionEntity us WHERE us.user.userId = :userId")
    void deleteByUserId(@Param("userId") String userId);
}