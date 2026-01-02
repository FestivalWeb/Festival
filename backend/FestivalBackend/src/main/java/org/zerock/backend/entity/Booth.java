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
    private Long priority;

    // [Getter 호환성] Admin 코드에서 isShow()를 호출할 수 있도록 함
    public boolean isShow() {
        return this.status;
    }
    
    public void setShow(boolean show) {
        this.status = show;
    }

    public void changeStatus(boolean status) {
        this.status = status;
    }

    // [수정] 파라미터 순서를 Service 코드와 맞춤
    public void updateInfo(String title, String context, String location, Long price, Long maxPerson, LocalDate eventDate, Long priority) {
        this.title = title;
        this.context = context;
        this.location = location;
        this.price = price;
        this.maxPerson = maxPerson;
        this.eventDate = eventDate;
        this.priority = priority;
    }

    // [추가] BoothAdminService에서 호출하는 이미지 추가 편의 메서드
    public void addImage(MediaFile mediaFile) {
        BoothImageId id = BoothImageId.builder()
                .boothId(this.id)
                .fileId(mediaFile.getFileId())
                .build();

        BoothImage image = BoothImage.builder()
                .id(id)
                .booth(this)
                .mediaFile(mediaFile)
                .build();

        this.images.add(image);
    }
    
    // [추가] 생성자 (created_by가 필요한 경우를 대비해 빌더 패턴 사용 권장하지만, 필드 추가가 어렵다면 생략 가능)
    // createdBy 필드가 Entity에 없으므로 Service에서 빌더 호출 시 제외했습니다.
}