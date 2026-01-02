package org.zerock.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.backend.dto.WeatherDto;
import org.zerock.backend.service.WeatherService;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    // [변경] 반환 타입: WeatherDto -> List<WeatherDto>
    @GetMapping
    public ResponseEntity<List<WeatherDto>> getWeather() {
        List<WeatherDto> forecast = weatherService.getNonsanForecast();
        return ResponseEntity.ok(forecast);
    }
}