package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicInsert
@EntityListeners(AuditingEntityListener.class)
@Table(name = "notice") // 소문자 테이블명
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Long noticeId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "context", columnDefinition = "TEXT", nullable = false)
    private String content; // 필드명은 content, DB 컬럼은 context

    @CreatedDate
    @Column(name = "create_date", updatable = false)
    private LocalDateTime createDate;

    @LastModifiedDate
    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @ColumnDefault("0")
    @Column(name = "view_count")
    @Builder.Default
    private Long viewCount = 0L;

    // [추가] 중요 공지 여부 (상단 고정용)
    @ColumnDefault("false")
    @Column(name = "important")
    @Builder.Default
    private boolean important = false;

    // 관리자(작성자)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private AdminUser adminUser;

    // 이미지 매핑
    @OneToMany(mappedBy = "notice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<NoticeImageMapping> images = new LinkedHashSet<>();

    public void increaseViewCount() {
        this.viewCount++;
    }

    public void updateNotice(String title, String content, boolean important) {
        this.title = title;
        this.content = content;
        this.important = important;
    }
}