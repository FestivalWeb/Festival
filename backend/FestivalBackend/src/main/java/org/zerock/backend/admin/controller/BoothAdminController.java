package org.zerock.backend.admin.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.admin.dto.booth.BoothDto;
import org.zerock.backend.admin.service.BoothAdminService;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/admin/booths")
@RequiredArgsConstructor
@Log4j2
public class BoothAdminController {

    private final BoothAdminService boothAdminService;

    // 1. 목록 조회
    @GetMapping
    public ResponseEntity<List<BoothDto.Response>> getAllBooths() {
        return ResponseEntity.ok(boothAdminService.getAllBooths());
    }

    // 2. 부스 등록
    @PostMapping
    public ResponseEntity<Long> createBooth(@RequestBody BoothDto.CreateRequest request, HttpServletRequest httpRequest) {
        Long boothId = boothAdminService.createBooth(request, httpRequest);
        return ResponseEntity.ok(boothId);
    }

    // 3. 상태 변경 (공개/비공개)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> toggleStatus(@PathVariable Long id, @RequestParam boolean isShow) {
        boothAdminService.toggleStatus(id, isShow);
        return ResponseEntity.ok().build();
    }

    // 4. 부스 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateBooth(@PathVariable Long id, @RequestBody BoothDto.CreateRequest request) {
        boothAdminService.updateBooth(id, request);
        return ResponseEntity.ok().build();
    }

    // 5. 부스 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooth(@PathVariable Long id) {
        boothAdminService.deleteBooth(id);
        return ResponseEntity.ok().build();
    }
}