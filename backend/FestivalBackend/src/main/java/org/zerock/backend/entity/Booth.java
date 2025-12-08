package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Getter  // [중요] 이게 있으면 밑에 getTitle() 같은거 안 써도 됨!
@Setter  // [중요] 이게 있으면 밑에 setTitle() 같은거 안 써도 됨!
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

    @Column(nullable = false)
    private Long price;

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