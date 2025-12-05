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
@Builder // [중요] 클래스 레벨 빌더
@AllArgsConstructor // [중요] 모든 필드 생성자 (빌더용)
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA용 기본 생성자
@DynamicInsert
@EntityListeners(AuditingEntityListener.class)
@Table(name = "post")
public class post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "context", length = 500)
    private String context;

    @CreatedDate
    @Column(name = "create_date", updatable = false)
    private LocalDateTime createDate;

    @LastModifiedDate
    @Column(name = "update_date")
    private LocalDateTime updateDate;

    // [수정] 빌더 패턴 사용 시 초기화 유지를 위해 @Builder.Default 필수
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<PostImgMapping> images = new LinkedHashSet<>();

    @ColumnDefault("0")
    @Column(name = "view")
    @Builder.Default
    private Long view = 0L;

    // [핵심 수정] 단순 String이 아니라 객체로 연결해야 Service 오류가 안 납니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private AdminUser adminUser;

    public void increaseViewCount() {
        this.view++;
    }

    public void updatePost(String title, String context) {
        this.title = title;
        this.context = context;
    }
}