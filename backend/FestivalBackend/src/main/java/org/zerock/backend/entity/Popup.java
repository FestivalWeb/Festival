package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert; // Default 값 적용을 위해

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicInsert // DB에 정의된 Default 값(priority=1)이 INSERT 시 적용되도록
@Table(name = "pop_up")
public class Popup extends BaseEntity { // BaseEntity 상속

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "popup_id")
    private Long popupId;

    @Column(name = "title", nullable = false, length = 128)
    private String title;

    @Column(name = "content", columnDefinition = "MEDIUMTEXT")
    private String content;

    @Column(name = "image_uri", length = 255)
    private String imageUri;

    // 스키마의 'Default: 1'을 어노테이션으로 명시
    @ColumnDefault("1") 
    @Column(name = "priority")
    private Long priority;

    // 상태: true = 사용, false = 중지
    @Column(name = "status", nullable = false)
    private boolean status = true;

    // 1:N 관계 (PopUp 1 : PopupSchedule N)
    // 'mappedBy'는 PopupSchedule 클래스의 'popUp' 필드 이름을 가리킴
    @OneToMany(mappedBy = "popUp", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PopupSchedule> schedules = new ArrayList<>();

    // 생성자 (Builder)
    @Builder
    public Popup(String title, String content, String imageUri, Long priority) {
        this.title = title;
        this.content = content;
        this.imageUri = imageUri;
        this.priority = priority;
    }

    // 수정 메서드 (예시)
    public void updateDetails(String title, String content, String imageUri, Long priority) {
        this.title = title;
        this.content = content;
        this.imageUri = imageUri;
        this.priority = priority;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}