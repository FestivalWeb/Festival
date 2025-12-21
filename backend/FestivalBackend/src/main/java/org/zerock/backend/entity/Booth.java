package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@DynamicInsert // Default 값(isShow=0 등) 적용을 위해 필수
@Table(name = "booth")
public class Booth extends BaseEntity { // [수정] 생성일/수정일 자동 관리

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booth_id")
    private Long id;

    // --- 기존 부스 필드 ---
    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "context", nullable = false, length = 500)
    private String context;

    @Column(name = "img", length = 500)
    private String img;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false)
    private Long price;

    @Column(name = "max_person", nullable = false)
    private Long maxPerson;

    @Column(nullable = false, length = 200)
    private String location;

    // --- [추가] 관리자 관리용 필드 ---
    
    // 공개 여부 (0: 작성중/숨김, 1: 공개)
    @Column(name = "is_show", nullable = false)
    @ColumnDefault("0") 
    private boolean isShow; 

    // 우선순위 (1이 제일 위)
    @Column(name = "priority")
    @ColumnDefault("1")
    private Long priority;

    // 생성자 ID (관리자)
    @Column(name = "created_by")
    private Long createdBy;

    // --- 이미지 연관 관계 ---
    @OneToMany(mappedBy = "booth", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<BoothImage> images = new LinkedHashSet<>();

    // --- [편의 메서드] 관리자 수정용 ---
    public void changeStatus(boolean isShow) {
        this.isShow = isShow;
    }

    public void updateInfo(String title, String context, String location, Long price, Long maxPerson, LocalDate eventDate, Long priority) {
        this.title = title;
        this.context = context;
        this.location = location;
        this.price = price;
        this.maxPerson = maxPerson;
        this.eventDate = eventDate;
        if(priority != null) this.priority = priority;
    }
}