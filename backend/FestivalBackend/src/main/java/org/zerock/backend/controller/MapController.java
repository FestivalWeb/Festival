package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.zerock.backend.service.MapService; // 방금 만든 서비스
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController // 이 클래스는 REST API 컨트롤러임을 선언
@RequiredArgsConstructor
@RequestMapping("/map") // '/map'으로 시작하는 모든 요청을 이 컨트롤러가 받음
public class MapController {

    private final MapService mapService; // MapService 주입

    /**
     * 주소 검색 API 테스트
     * GET /map/search?query=검색어
     */
    @GetMapping("/search")
    public ResponseEntity<String> searchAddress(@RequestParam("query") String query) {
        
        // MapService를 호출해서 결과를 받아옴
        String jsonResponse = mapService.searchAddress(query);

        // API 응답(JSON 문자열)을 그대로 클라이언트에게 반환
        return ResponseEntity.ok(jsonResponse);
    }
}