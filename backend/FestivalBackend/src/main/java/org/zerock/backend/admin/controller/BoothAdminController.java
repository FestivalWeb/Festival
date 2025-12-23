package org.zerock.backend.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.admin.service.BoothAdminService;
import org.zerock.backend.admin.dto.booth.BoothDto;
import org.zerock.backend.entity.Booth;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/admin/booths")
@RequiredArgsConstructor
public class BoothAdminController {

    private final BoothAdminService boothAdminService;

    // 목록 조회
    @GetMapping
    public List<Booth> getList() {
        return boothAdminService.getAllBooths();
    }

    // 생성
    @PostMapping
    public Long create(@RequestBody BoothDto.CreateRequest request, HttpServletRequest httpRequest) {
        return boothAdminService.createBooth(request, httpRequest);
    }

    // 수정
    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody BoothDto.CreateRequest request) {
        boothAdminService.updateBooth(id, request);
    }

    // 공개/비공개 토글 (PATCH)
    @PatchMapping("/{id}/status")
    public void changeStatus(@PathVariable Long id, @RequestParam boolean isShow) {
        boothAdminService.toggleStatus(id, isShow);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        boothAdminService.deleteBooth(id);
    }
}