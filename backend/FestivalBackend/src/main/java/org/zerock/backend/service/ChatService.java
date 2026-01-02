package org.zerock.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    // ▼▼▼ [필수] 발급받은 API 키를 여기에 넣으세요! (AIza...) ▼▼▼
    private final String GEMINI_API_KEY = "AIzaSyAoURGkC-ayDxicDQmQ1Vmkk6_rpX5QF28"; 
    
    // [수정완료] gemini-1.5-flash -> gemini-2.5-flash (최신 모델로 변경)
    private final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;

    public String getResponse(String userMessage) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            ObjectMapper mapper = new ObjectMapper();

            // 1. 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 2. AI 페르소나 설정 (시스템 프롬프트)
            String systemPrompt = """
                    너는 '논산딸기축제'의 친절한 AI 안내원 '베리'야.
                    사용자의 질문에 대해 아래 축제 정보를 바탕으로, 이모지를 섞어서 친절하고 발랄하게 답변해줘.
                    
                    [축제 정보]
                    - 기간: 2025년 3월 21일(목) ~ 3월 24일(일)
                    - 장소: 논산시민운동장 (충남 논산시 관촉동 339-1)
                    - 주요행사:  헬기탑승, 불꽃놀이, 딸기 디저트 카페, K-POP 공연
                    - 주차: 제1,2주차장 이용 (만차 시 무료 셔틀버스 20분 간격 운행)
                    - 셔틀버스: 논산역, 터미널 ↔ 행사장 순환
                    - 입장료: 기본 무료 (일부 체험비 별도)
                    - 체험부스: 딸기수확체험, 딸기 떡 메치기, 케이크 공방, 지역 농특산물 판매존
                    
                    답변은 3문장 이내로 간결하게 해줘. 정보에 없는 내용은 '축제 본부(041-746-8386)로 문의해주세요! 🍓'라고 답해.
                    
                    사용자 질문: %s
                    """.formatted(userMessage);

            // 3. 요청 데이터 생성
            Map<String, Object> contentPart = new HashMap<>();
            contentPart.put("text", systemPrompt);
            
            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", List.of(contentPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(parts));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // 4. API 호출
            String result = restTemplate.postForObject(API_URL, entity, String.class);
            
            // 5. 응답 파싱
            JsonNode root = mapper.readTree(result);
            return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        } catch (Exception e) {
            // 에러 로그를 좀 더 자세히 출력
            log.error("Gemini API Error: {}", e.getMessage());
            return "죄송해요, AI 연결에 문제가 생겼어요. 😢 (관리자에게 문의해주세요)";
        }
    }
}