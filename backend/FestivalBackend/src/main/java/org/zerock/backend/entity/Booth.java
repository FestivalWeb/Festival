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
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicInsert
@Table(name = "booth")
public class Booth {

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

    // [추가] 운영 시간 (예: "10:00 - 15:00")
    @Column(name = "time", length = 50)
    private String time;

    @Column(nullable = false)
    private Long price;

    @ColumnDefault("0")
    @Column(name = "current_person")
    @Builder.Default
    private Long currentPerson = 0L;

    @Column(name = "max_person", nullable = false)
    private Long maxPerson;

    @Column(nullable = false, length = 200)
    private String location;

    @ColumnDefault("true")
    @Column(name = "status")
    @Builder.Default
    private boolean status = true; 

    @OneToMany(mappedBy = "booth", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<BoothImage> images = new LinkedHashSet<>();

    @ColumnDefault("1")
    @Column(name = "priority")
    private Long priority; // 우선순위 필드 추가

    // [추가] Getter 메서드 호환성 (Lombok이 getStatus()를 만들지만, Admin 코드는 isShow()를 찾을 수 있음)
    public boolean isShow() {
        return this.status;
    }
    
    public void setShow(boolean show) {
        this.status = show;
    }

    // [추가] updateInfo 메서드 (Admin 서비스에서 호출)
    public void updateInfo(String title, String context, String location, Long maxPerson, Long priority, java.time.LocalDate eventDate, long price) {
        this.title = title;
        this.context = context;
        this.location = location;
        this.maxPerson = maxPerson;
        this.priority = priority;
        this.eventDate = eventDate;
        this.price = price;
    }

    public void changeStatus(boolean status) {
        this.status = status;
    }
}