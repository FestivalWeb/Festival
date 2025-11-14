package org.zerock.backend.entity;



import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass // 공통 매핑 정보
@EntityListeners(AuditingEntityListener.class) // Auditing 기능 포함
public abstract class BaseEntity {

    //--- 생성/수정 시간 ---
    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    //--- 생성/수정자 ---
    @CreatedBy
    @Column(name = "created_by", updatable = false, nullable = false)
    private Long createdBy; // 생성자 ID

    @LastModifiedBy
    @Column(name = "updated_by", nullable = false)
    private Long updatedBy; // 수정자 ID
}