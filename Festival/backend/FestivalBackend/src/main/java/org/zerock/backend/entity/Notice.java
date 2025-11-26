package org.zerock.backend.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Notice(공지사항) 엔티티.
 *
 * 공지 제목, 내용, 작성일, 조회수 등의 기본 정보를 저장하는 테이블이며
 * 관리자(admin_user)가 작성/수정한 공지임.
 *
 * 이미지(첨부파일)는 notice_img_mapping 조인 테이블을 통해
 * MediaFile 엔티티와 연결된다.
 */

@Entity
@Table(name = "Notice")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notice {
    /**
     * 공지 ID (PK, auto_increment)
     */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Long noticeId;

    /**
     * 공지 제목
     */
    @Column(name = "title", length = 200, nullable = false)
    private String title;

    /**
     * 공지 내용
     */
    @Column(name = "context", length = 500, nullable = false)
    private String context;

    /**
     * 작성일(YYYY-MM-DD)
     */
    @Column(name = "`create`", nullable = false)
    private java.time.LocalDate createdDate;

    /**
     * 수정일(YYYY-MM-DD)
     */
    @Column(name = "`update`", nullable = false)
    private java.time.LocalDate updatedDate;

    /**
     * 조회 수
     */
    @Column(name = "`view`", nullable = false)
    private Long viewCount;

    /**
     * 대표 이미지 경로 (선택)
     * — 단일 이미지(썸네일)를 저장할 수 있음.
     * — 여러 이미지는 NoticeImageMapping으로 관리됨. (삭제 예정 - 이유: ERD 작성 때 삭제하지 못하고 들어감)
     */
    @Column(name = "img", length = 500)
    private String img;

    /**
     * 공지 작성/수정한 관리자
     * Notice.admin_id → admin_user.admin_id (N:1 관계)
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_id", nullable = false)
    private AdminUser adminUser; // adminUser 테이블 엔티티 필요함

    /**
     * 공지의 첨부 이미지 목록 (1:N)
     * notice_img_mapping 조인 엔티티를 통해 MediaFile 과 연결됨.
     *
     * @Builder.Default 를 사용하여 builder() 사용 시에도
     * 컬렉션이 null 이 되지 않도록 초기화함.
     */
    @OneToMany(mappedBy = "notice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<NoticeImageMapping> noticeImages = new LinkedHashSet<>();
}
    