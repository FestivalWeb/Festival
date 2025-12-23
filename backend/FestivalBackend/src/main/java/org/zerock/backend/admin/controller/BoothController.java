package org.zerock.backend.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.zerock.backend.admin.dto.booth.BoothDto;
import org.zerock.backend.admin.service.BoothService;

import java.util.List;

@RestController
@RequestMapping("/api/booths") // 유저용 주소
@RequiredArgsConstructor
public class BoothController {

    private final BoothService boothService;

    // 유저에게 공개된 부스 목록만 반환 (우선순위 순)
    @GetMapping
    public List<BoothDto.Response> getList() {
        return boothService.getBoothList();
    }
    
    // 상세 조회 (클릭했을 때)
    @GetMapping("/{id}")
    public BoothDto.Response getDetail(@PathVariable Long id) {
        return boothService.getBoothDetail(id);
    }
}