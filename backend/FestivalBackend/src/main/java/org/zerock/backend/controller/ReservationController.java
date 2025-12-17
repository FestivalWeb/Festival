package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.dto.ReservationDto;
import org.zerock.backend.service.ReservationService;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // 예약하기
    @PostMapping
    public ResponseEntity<String> reserve(@RequestBody ReservationDto.Request request) {
        reservationService.makeReservation(request);
        return ResponseEntity.ok("예약이 완료되었습니다.");
    }

    // [수정] 내 예약 목록 (페이징 적용)
    // 예: /api/reservations/me?userId=user1&page=0&size=5
    @GetMapping("/me")
    public ResponseEntity<Page<ReservationDto.Response>> getMyReservations(
            @RequestParam("userId") String userId,
            @PageableDefault(size = 5, sort = "reserDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(reservationService.getMyReservations(userId, pageable));
    }
    
    // 예약 취소
    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancel(@PathVariable("id") Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok("예약이 취소되었습니다.");
    }
}