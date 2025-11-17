package org.zerock.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate; // [중요] date 타입은 LocalDate 사용

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // DB 타입이 'date'이므로 LocalDate 사용 (시간 정보 제외, 날짜만 저장)
    @Column(name = "reser_date", nullable = false)
    private LocalDate reserDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    // bigint(20) 타입 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booth_id", nullable = false)
    private Booth booth;

    @Builder
    public Reservation(LocalDate reserDate, UserEntity user, Booth booth) {
        this.reserDate = reserDate;
        this.user = user;
        this.booth = booth;
    }
}