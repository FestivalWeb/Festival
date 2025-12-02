package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
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
@DynamicInsert // Default 값(view=0) 적용을 위해
@EntityListeners(AuditingEntityListener.class) // BaseEntity 상속 안 하므로 직접 리스너 추가
@Table(name = "post")
public class post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    // 스키마에 'context'라고 되어 있어서 그대로 썼습니다. (보통 'content'를 많이 씁니다)
    @Column(name = "context", length = 500)
    private String context;

    //--- 날짜 관련 (이전 BaseEntity와 이름이 달라서 직접 선언) ---
    
    @CreatedDate // 생성 시 날짜 자동 저장
    @Column(name = "create_date", updatable = false)
    private LocalDateTime createDate; // DB 타입이 date라도 보통 LocalDateTime 권장 (필요시 LocalDate로 변경)

    @LastModifiedDate // 수정 시 날짜 자동 저장
    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<PostImgMapping> images = new LinkedHashSet<>();
    //--- 기타 컬럼 ---

    @ColumnDefault("0") // 조회수 기본값 0
    @Column(name = "view")
    private Long view;

    // 스키마상 user_id가 varchar(30)이므로 String 매핑
    // (만약 User 테이블과 관계를 맺으려면 User 엔티티의 ID 타입도 String이어야 함)
    @Column(name = "user_id", length = 30)
    private String userId;

    // admin_id는 bigint(20)이므로 Long 매핑
    @Column(name = "admin_id")
    private Long adminId;

    // 생성자 (Builder)
    @Builder
    public post(String title, String context, String userId, Long adminId) {
        this.title = title;
        this.context = context;
        this.userId = userId;
        this.adminId = adminId;
        this.view = 0L; // 기본값 초기화
    }

    // 조회수 증가 메서드 (비즈니스 로직)
    public void increaseViewCount() {
        this.view++;
    }
    
    // 내용 수정 메서드
    public void updatePost(String title, String context) {
        this.title = title;
        this.context = context;
    }
}