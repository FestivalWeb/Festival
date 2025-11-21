package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
public class UserEntity {

    @Id
    @Column(name = "user_id", length = 30, nullable = false)
    private String userId;

    @Column(nullable = false, length = 255) 
    private String password;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 10)
    private String sex;

    @Column(name = "verify_code", length = 10)
    private String verifyCode;

    @Column(name = "code_valid")
    private LocalDateTime codeValid;

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;

    @Column(name = "social_id", length = 255, unique = true)
    private String socialId;

    @Column(name = "provider", length = 20)
    private String provider;
}