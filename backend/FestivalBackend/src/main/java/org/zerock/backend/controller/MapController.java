package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.zerock.backend.service.MapService; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController 
@RequiredArgsConstructor
@RequestMapping("/map") 
public class MapController {

    private final MapService mapService;

    
    @GetMapping("/search")
    public ResponseEntity<String> searchAddress(@RequestParam("query") String query) {
        
        
        String jsonResponse = mapService.searchAddress(query);

        
        return ResponseEntity.ok(jsonResponse);
    }
}