package org.zerock.backend.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    
    @Column(name = "visibility", length = 7, nullable = false)
    private String visibility; 

    
    @Column(name = "status", nullable = false)
    private boolean status = false; 
  
    @Column(name = "skin", length = 50)
    private String skin = "basic"; 

    
    @Column(name = "post_count", nullable = false)
    private Long postCount = 0L; 
   
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

   
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // [추가] 권한 설정 필드 (Admin 기능용)
    @Column(name = "read_role", length = 20)
    private String readRole;

    @Column(name = "write_role", length = 20)
    private String writeRole;

    // [추가] Post와의 양방향 관계 (PostService 등에서 사용)
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>(); // post -> Post (대문자 주의)
    
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

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MediaFile> mediaFiles = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // DB 컬럼명 (보통 user_id)
    @ToString.Exclude // 무한루프 방지
    private UserEntity user;

    public void addMediaFile(MediaFile file) {
    this.mediaFiles.add(file); // 1. 내 리스트에 파일 추가
    file.setBoard(this);       // 2. ★중요★ 파일한테 "네 주인은 나야"라고 알려줌 (이게 board_id를 채움)
}
}