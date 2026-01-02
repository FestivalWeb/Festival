package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.dto.BoothDto;
import org.zerock.backend.service.BoothService;

import java.util.List;

@RestController
@RequestMapping("/api/booths")
@RequiredArgsConstructor
public class BoothController {

    private final BoothService boothService;

    // 목록 조회
    @GetMapping
    public ResponseEntity<List<BoothDto.Response>> getList() {
        return ResponseEntity.ok(boothService.getBoothList());
    }

    // 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<BoothDto.Response> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(boothService.getBoothDetail(id));
    }

    // 작성 (관리자만 가능)
    @PostMapping
    public ResponseEntity<String> create(@RequestBody BoothDto.CreateRequest request) {
        boothService.createBooth(request);
        return ResponseEntity.ok("부스가 생성되었습니다.");
    }
}