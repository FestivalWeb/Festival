package org.zerock.backend.entity;

import lombok.Getter;
import lombok.Setter;


import jakarta.persistence.*; 

@Entity
@Getter
@Setter
@Table(name = "admin_ip_whitelist")
public class AdminIpWhitelist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ip_address", length = 50, nullable = false, unique = true)
    private String ipAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private AdminUser adminUser;   // ← adminId → admin 으로 타입/이름 변경
}
