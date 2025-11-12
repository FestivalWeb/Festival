package org.zerock.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "admin_login_audit")
public class AdminLoginAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audit_id")
    private Long auditId;

   
    @Column(name = "username", length = 60, nullable = false)
    private String username;

  
    @Column(name = "success", nullable = false)
    private boolean success;

   
    @Column(name = "reason", length = 120)
    private String reason;

  
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

   
    @Column(name = "user_agent", length = 255)
    private String userAgent;

    
    @Column(name = "occurred_at", nullable = false, updatable = false)
    private LocalDateTime occurredAt;

  
    @PrePersist
    protected void onCreate() {
        occurredAt = LocalDateTime.now();
    }
}