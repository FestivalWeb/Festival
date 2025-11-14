package org.zerock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.backend.entity.UserEntity;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, String> {

    // user_id 로 한 명 조회 (로그인, 사용자 상세 조회용)
    Optional<UserEntity> findByUserId(String userId);

    // email 로 조회 (중복 체크)
    Optional<UserEntity> findByEmail(String email);

    // user_id 중복 체크
    boolean existsByUserId(String userId);

    // email 중복 체크
    boolean existsByEmail(String email);

    // 이메일 인증 코드 조회
    Optional<UserEntity> findByVerifyCode(String verifyCode);

    // 인증 여부로 조회 (isVerified = true/false)
    Optional<UserEntity> findByUserIdAndIsVerified(String userId, boolean isVerified);
}
