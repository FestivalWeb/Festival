package org.zerock.backend.admin.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.admin.dto.booth.BoothDto;
import org.zerock.backend.admin.service.BoothAdminService;
// Entity import는 지워도 됩니다 (Booth 안 씀)
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/admin/booths")
@RequiredArgsConstructor
@Log4j2
public class BoothAdminController {

    private final BoothAdminService boothAdminService;

    // [★수정] 반환 타입 변경 (Entity -> DTO)
    @GetMapping
    public List<BoothDto.Response> getList() {
        return boothAdminService.getAllBooths();
    }

    // (나머지 메서드는 그대로)
    @PostMapping
    public Long create(@RequestBody BoothDto.CreateRequest request, HttpServletRequest httpRequest) {
        return boothAdminService.createBooth(request, httpRequest);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody BoothDto.CreateRequest request) {
        boothAdminService.updateBooth(id, request);
    }

    @PatchMapping("/{id}/status")
    public void changeStatus(@PathVariable("id") Long id, @RequestParam("isShow") boolean isShow) {
        log.info("상태 변경 요청 ID: " + id + ", 값: " + isShow);
        boothAdminService.toggleStatus(id, isShow);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        boothAdminService.deleteBooth(id);
    }
}