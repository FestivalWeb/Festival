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

    // varchar(30) 타입 매핑
    @Column(name = "user_id", nullable = false, length = 30)
    private String userId;

    // bigint(20) 타입 매핑
    // (나중에 Booth 엔티티가 생기면 @ManyToOne 관계로 변경 가능)
    @Column(name = "booth_id", nullable = false)
    private Long boothId;

    @Builder
    public Reservation(LocalDate reserDate, String userId, Long boothId) {
        this.reserDate = reserDate;
        this.userId = userId;
        this.boothId = boothId;
    }
}