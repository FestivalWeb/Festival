package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicInsert
@EntityListeners(AuditingEntityListener.class)
@Table(name = "post")
public class Post {

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

    // [중요] Board와 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<PostImgMapping> images = new LinkedHashSet<>();

    @ColumnDefault("0")
    @Column(name = "view")
    @Builder.Default
    private Long view = 0L;

    // [중요] UserEntity 객체와 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    // [중요] AdminUser 객체와 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private AdminUser adminUser;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MediaFile> mediaFiles = new ArrayList<>();

    // --- 편의 메서드 ---
    public void increaseViewCount() {
        this.view++;
    }

    public void updatePost(String title, String context) {
        this.title = title;
        this.context = context;
    }

    public void setBoard(Board board) {
        this.board = board;
        if (board != null && !board.getPosts().contains(this)) {
            board.getPosts().add(this);
        }
    }

    // ▼▼▼ [핵심 수정] DTO 에러 해결을 위한 Helper 메서드 추가 ▼▼▼
    // PostResponse 등에서 post.getAdminId()를 호출할 때, 이 메서드가 adminUser 객체에서 ID를 꺼내줍니다.
    public Long getAdminId() {
        return (this.adminUser != null) ? this.adminUser.getAdminId() : null;
    }

    public String getUserId() {
        return (this.user != null) ? this.user.getUserId() : null;
    }
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
}