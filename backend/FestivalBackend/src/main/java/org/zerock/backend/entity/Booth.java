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
@DynamicInsert
@Table(name = "booth")
public class Booth extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booth_id")
    private Long id;

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

    @Column(name = "is_show", nullable = false)
    @ColumnDefault("0")
    private boolean isShow;

    @Column(name = "priority")
    @ColumnDefault("1")
    private Long priority;

    @Column(name = "created_by")
    private Long createdBy;

    // BoothImage와 연관관계
    @OneToMany(mappedBy = "booth", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<BoothImage> images = new LinkedHashSet<>();

    // --- 편의 메서드 ---

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

    // [수정 완료] MediaFile 엔티티 구조에 맞게 수정
    public void addImage(MediaFile mediaFile) {
        BoothImage boothImage = BoothImage.builder()
                .id(new BoothImageId()) // 빈 ID 객체 생성 (JPA가 @MapsId로 알아서 채움)
                .booth(this)
                .mediaFile(mediaFile)
                .build();
        
        this.images.add(boothImage);
    }
}