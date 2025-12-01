package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

// [중요] PopUp 클래스를 인식할 수 있도록 import 확인

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "popup_schedule") // DB 테이블명: 소문자 popup_schedule
public class popupschedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id") // 컬럼명: 소문자 schedule_id
    private Long scheduleId;

    // --- 관계 설정 ---
    // DB의 popup_id 컬럼(소문자)을 통해 PopUp 엔티티와 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "popup_id", nullable = false) // 컬럼명: 소문자 popup_id
    private popup popUp;

    @Column(name = "start_at", nullable = false) // 컬럼명: 소문자 start_at
    private LocalDateTime startAt;

    @Column(name = "end_at", nullable = false) // 컬럼명: 소문자 end_at
    private LocalDateTime endAt;

    public void updatePeriod(LocalDateTime startAt, LocalDateTime endAt) {
    this.startAt = startAt;
    this.endAt = endAt;
}
    // --- 생성자 ---
    @Builder
    public popupschedule(popup popUp, LocalDateTime startAt, LocalDateTime endAt) {
        this.popUp = popUp;
        this.startAt = startAt;
        this.endAt = endAt;
    }
}