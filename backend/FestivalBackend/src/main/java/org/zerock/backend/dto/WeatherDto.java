package org.zerock.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WeatherDto {
    private String date;        // 날짜 (예: 2025-03-27)
    private String description; // 날씨 설명 (예: 맑음)
    private double temp;        // 온도
    private double minTemp;     // 최저 온도
    private double maxTemp;     // 최고 온도
    private int humidity;       // 습도
    private String icon;        // 날씨 아이콘 코드
}