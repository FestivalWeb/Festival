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
}