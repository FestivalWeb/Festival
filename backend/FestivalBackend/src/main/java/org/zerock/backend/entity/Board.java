package org.zerock.backend.entity;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "board")
public class Board {

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long boardId;

    
    @Column(name = "created_by", nullable = false)
    private Long createdBy;

   
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