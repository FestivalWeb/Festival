package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
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
}
