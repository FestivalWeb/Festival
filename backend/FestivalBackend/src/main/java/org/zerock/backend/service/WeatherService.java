package org.zerock.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.zerock.backend.dto.WeatherDto;

import java.time.LocalTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class WeatherService {

    @Value("${openweathermap.api.key}")
    private String apiKey; 

    private final String CITY = "Nonsan";
    private final String BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

    public List<WeatherDto> getNonsanForecast() {
        List<WeatherDto> forecastList = new ArrayList<>();

        try {
            RestTemplate restTemplate = new RestTemplate();
            // 섭씨(metric), 한국어(kr) 설정
            String url = String.format("%s?q=%s&appid=%s&units=metric&lang=kr", BASE_URL, CITY, apiKey);
            String result = restTemplate.getForObject(url, String.class);
            
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(result);
            JsonNode listNode = root.path("list");

            // 1. 날짜별로 데이터 그룹화
            Map<String, List<JsonNode>> dailyMap = new LinkedHashMap<>();
            for (JsonNode node : listNode) {
                String dtTxt = node.path("dt_txt").asText(); // 예: "2025-03-27 12:00:00"
                String dateKey = dtTxt.split(" ")[0];        // "2025-03-27" (프론트엔드 호환용)
                
                dailyMap.computeIfAbsent(dateKey, k -> new ArrayList<>()).add(node);
            }

            // 2. 현재 사용자 접속 시간(시) 구하기 (예: 14시)
            int currentHour = LocalTime.now().getHour();

            int count = 0;
            for (String dateKey : dailyMap.keySet()) {
                if (count >= 4) break; // 4일치만

                List<JsonNode> dayData = dailyMap.get(dateKey);
                
                // (1) [하루 전체]의 최저/최고 기온 찾기 (8개 데이터 모두 스캔)
                double dailyMin = Double.MAX_VALUE;
                double dailyMax = Double.MIN_VALUE;
                
                for (JsonNode node : dayData) {
                    double tempMin = node.path("main").path("temp_min").asDouble();
                    double tempMax = node.path("main").path("temp_max").asDouble();
                    if (tempMin < dailyMin) dailyMin = tempMin;
                    if (tempMax > dailyMax) dailyMax = tempMax;
                }

                // (2) 현재 시간(currentHour)에 맞춰 온도 계산 (선형 보간법)
                // -> 12시 데이터와 15시 데이터 사이의 값을 계산해서 13시, 14시 온도를 만듦
                double interpolatedTemp = 0.0;
                String mainIcon = "";
                String mainDesc = "";
                
                JsonNode prevNode = null;
                JsonNode nextNode = null;
                int prevHour = -1;
                int nextHour = -1;

                // 시간대 찾기
                for (JsonNode node : dayData) {
                    String timePart = node.path("dt_txt").asText().split(" ")[1]; // "15:00:00"
                    int h = Integer.parseInt(timePart.split(":")[0]); // 15

                    if (h <= currentHour) {
                        prevNode = node;
                        prevHour = h;
                    }
                    if (h > currentHour && nextNode == null) {
                        nextNode = node;
                        nextHour = h;
                    }
                }

                // 온도 계산 로직
                if (prevNode != null && nextNode != null) {
                    // 앞뒤 데이터가 모두 있으면 비율대로 계산
                    double t1 = prevNode.path("main").path("temp").asDouble();
                    double t2 = nextNode.path("main").path("temp").asDouble();
                    double ratio = (double)(currentHour - prevHour) / (nextHour - prevHour);
                    
                    interpolatedTemp = t1 + (t2 - t1) * ratio; // 보간된 온도
                    
                    // 아이콘은 더 가까운 시간대 선택
                    if (ratio < 0.5) {
                        mainIcon = prevNode.path("weather").get(0).path("icon").asText();
                        mainDesc = prevNode.path("weather").get(0).path("description").asText();
                    } else {
                        mainIcon = nextNode.path("weather").get(0).path("icon").asText();
                        mainDesc = nextNode.path("weather").get(0).path("description").asText();
                    }
                } else if (prevNode != null) {
                    // 이전 데이터만 있으면 그것 사용
                    interpolatedTemp = prevNode.path("main").path("temp").asDouble();
                    mainIcon = prevNode.path("weather").get(0).path("icon").asText();
                    mainDesc = prevNode.path("weather").get(0).path("description").asText();
                } else if (nextNode != null) {
                    // 다음 데이터만 있으면 그것 사용
                    interpolatedTemp = nextNode.path("main").path("temp").asDouble();
                    mainIcon = nextNode.path("weather").get(0).path("icon").asText();
                    mainDesc = nextNode.path("weather").get(0).path("description").asText();
                } else {
                    continue; // 데이터 없음
                }

                WeatherDto dto = WeatherDto.builder()
                        .date(dateKey)
                        .description(mainDesc)
                        .icon(mainIcon)
                        .temp(interpolatedTemp) // 현재 시각 기준 정밀 온도
                        .minTemp(dailyMin)      // 하루 전체 최저
                        .maxTemp(dailyMax)      // 하루 전체 최고
                        .humidity(dayData.get(0).path("main").path("humidity").asInt())
                        .build();
                
                forecastList.add(dto);
                count++;
            }

        } catch (Exception e) {
            log.error("날씨 정보 파싱 실패: {}", e.getMessage());
        }

        return forecastList;
    }
}