package org.zerock.backend.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.LinkedHashSet;
import java.util.Set;


@Entity
@Table(name = "Notice")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Long noticeId;

    @Column(name = "title", length = 200, nullable = false)
    private String title;

    @Column(name = "context", length = 500, nullable = false)
    private String context;

    @Column(name = "`create`", nullable = false)
    private java.time.LocalDate createdDate;

    @Column(name = "`update`", nullable = false)
    private java.time.LocalDate updatedDate;

    @Column(name = "`view`", nullable = false)
    private Long viewCount;

    @Column(name = "img", length = 500)
    private String img;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_id", nullable = false)
    private AdminUser adminUser; // adminUser 테이블 엔티티 필요함

    @OneToMany(mappedBy = "notice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<NoticeImageMapping> noticeImages = new LinkedHashSet<>();
}
    