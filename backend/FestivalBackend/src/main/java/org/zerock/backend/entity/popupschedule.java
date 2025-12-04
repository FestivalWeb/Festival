package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "popup_schedule")
public class PopupSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long scheduleId;

    // Popup 엔티티와 N:1 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "popup_id", nullable = false)
    private Popup popUp; // Popup 엔티티의 mappedBy="popUp"과 매칭됨

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at", nullable = false)
    private LocalDateTime endAt;

    @Builder
    public PopupSchedule(Popup popUp, LocalDateTime startAt, LocalDateTime endAt) {
        this.popUp = popUp;
        this.startAt = startAt;
        this.endAt = endAt;
    }
}