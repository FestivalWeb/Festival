package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "admin_user")
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long adminId;

    @Column(nullable = false, length = 60)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, length = 120)
    private String email;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;   // 최근 로그인 시간
    
    // 권한 목록 (AdminUser 1 ↔ N AdminRole)
    @OneToMany(mappedBy = "adminUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<AdminRole> roles = new LinkedHashSet<>();

    // 활동 로그
    @OneToMany(mappedBy = "adminUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<AdminActivityLog> activityLogs = new LinkedHashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "approve_status", nullable = false, length = 20)
    @Builder.Default
    private AdminApproveStatus approveStatus = AdminApproveStatus.PENDING;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt;   // 가입 요청 시각

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;    // SUPER가 승인한 시각

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")  // FK(admin_user.admin_id) 승인자
    private AdminUser approvedBy;
}
