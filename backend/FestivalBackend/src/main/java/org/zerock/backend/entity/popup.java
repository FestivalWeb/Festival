package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicInsert
@Table(name = "popup") // DB 테이블명 소문자 통일 (권장)
public class Popup extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "popup_id") // 컬럼명 소문자 통일
    private Long popupId;

    @Column(name = "title", nullable = false, length = 128)
    private String title;

    @Column(name = "content", columnDefinition = "MEDIUMTEXT")
    private String content;

    @Column(name = "image_uri", length = 255)
    private String imageUri;

    @ColumnDefault("1")
    @Column(name = "priority")
    private Long priority;

    // [수정] mappedBy는 PopupSchedule의 'popUp' 필드명과 일치해야 함 (대소문자 주의)
    @OneToMany(mappedBy = "popUp", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PopupSchedule> schedules = new ArrayList<>();

    @Builder
    public Popup(String title, String content, String imageUri, Long priority) {
        this.title = title;
        this.content = content;
        this.imageUri = imageUri;
        this.priority = priority;
    }

    public void updateDetails(String title, String content, String imageUri, Long priority) {
        this.title = title;
        this.content = content;
        this.imageUri = imageUri;
        this.priority = priority;
    }
}