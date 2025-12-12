package org.zerock.backend.entity;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList; // 추가
import java.util.List;      // 추가

@Entity
@Getter
@Setter
@Table(name = "board")
public class Board {

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long boardId;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private AdminUser createdBy;   // ← 관리자와 연관관계 (현재 db 복합키 이지만, 나중에 created_by는 pk 제외시켜야함 - 11.17)

   
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    
    // [삭제] private String visibility;

    // [추가] 읽기 권한
    @Column(name = "read_role", length = 20, nullable = false)
    private String readRole = "PUBLIC";

    // [추가] 쓰기 권한
    @Column(name = "write_role", length = 20, nullable = false)
    private String writeRole = "MEMBER";
    
    @Column(name = "status", nullable = false)
    private boolean status = false; 
  
    @Column(name = "skin", length = 50)
    private String skin = "basic"; 

    
    // [추가] 하이버네이트가 조회할 때마다 서브쿼리를 날려서 개수를 가져옵니다.
    @org.hibernate.annotations.Formula("(SELECT COUNT(*) FROM post p WHERE p.board_id = board_id)")
    private Long postCount;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

   
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // ▼ [추가됨] 게시글들과의 관계 설정 (1:N)
    // mappedBy = "board"는 post 엔티티에 있는 필드명입니다.
    @OneToMany(mappedBy = "board")
    private List<post> posts = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}