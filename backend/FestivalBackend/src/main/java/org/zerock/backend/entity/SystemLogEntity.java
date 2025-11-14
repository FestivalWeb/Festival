package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
//import com.festival.backend.entity.LogLevel;

@Entity
@Table(name = "system_log")
@Getter
@Setter
@NoArgsConstructor
public class SystemLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sys_log_id")
    private Long sysLogId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private LogLevel level;

    @Column(nullable = false, length = 255)
    private String message;

    @Column(length = 255)
    private String path;

    @Column(name = "ip_address", nullable = false, length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 255)
    private String userAgent;

    @Column(length = 255)
    private String referrer;

    @Column(name = "status_code")
    private Long statusCode;

    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;
}
