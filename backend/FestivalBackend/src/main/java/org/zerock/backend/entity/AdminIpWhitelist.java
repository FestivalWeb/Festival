package org.zerock.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class AdminIpWhitelist {

    /**
     * IP 주소 (기본 키)
     * User 엔티티의 user_id처럼 문자열 ID로 사용
     */
    @Id
    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    /**
     * 설명 (예: "본사 사무실", "개발자 IP")
     */
    @Column(length = 255)
    private String description;

    /**
     * 등록 날짜
     */
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    /**
     * 엔티티가 저장되기 전에 자동으로 날짜 설정
     */
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }

}