package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.zerock.backend.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/weather")
public class WeatherController {

    private final WeatherService weatherService;

    
    @GetMapping("/nonsan")
    public ResponseEntity<String> getNonsanWeather() {
        
        
        String jsonResponse = weatherService.getWeatherByCityName("Nonsan");

        return ResponseEntity.ok(jsonResponse);
    }
}