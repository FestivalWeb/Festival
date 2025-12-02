
package org.zerock.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class WeatherService {

    private final RestTemplate restTemplate;

    @Value("${openweathermap.api.key}")
    private String weatherApiKey;

    private final String WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

    
    public String getWeatherByCoords(double lat, double lon) {
        
        String url = String.format(
            "%s?lat=%f&lon=%f&appid=%s&units=metric&lang=kr",
            WEATHER_API_URL, lat, lon, weatherApiKey
        );

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }

    
    public String getWeatherByCityName(String cityName) {
        
        
        String url = String.format(
            "%s?q=%s&appid=%s&units=metric&lang=kr",
            WEATHER_API_URL, cityName, weatherApiKey
        );

       
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }
}