package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class WeatherService {

    // RestTemplateConfig에 등록된 Bean을 주입받음
    private final RestTemplate restTemplate; 

    // application.properties에 추가할 키
    @Value("${openweathermap.api.key}")
    private String weatherApiKey;

    private final String WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

    /**
     * 위도(lat)와 경도(lon)를 기준으로 날씨 정보를 JSON 문자열로 반환합니다.
     */
    public String getWeatherByCoords(double lat, double lon) {
        
        // 섭씨온도(units=metric)와 한국어(lang=kr)로 요청
        String url = String.format(
            "%s?lat=%f&lon=%f&appid=%s&units=metric&lang=kr",
            WEATHER_API_URL, lat, lon, weatherApiKey
        );

        // API 호출
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        return response.getBody();
    }
}