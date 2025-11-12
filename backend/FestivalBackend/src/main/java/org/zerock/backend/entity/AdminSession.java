package org.zerock.backend.entity;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "admin_session")
public class AdminSession {

    
    @Id
    @Column(name = "session_id", length = 36)
    private String sessionId;

    
    @Column(name = "admin_id", nullable = false)
    private Long adminId;

   
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

   
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    
    @Column(name = "user_agent", length = 255)
    private String userAgent;

    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

   
    @Column(name = "is_revoked", nullable = false)
    private boolean isRevoked = false; 

   
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}