package org.zerock.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * CORS (Cross-Origin Resource Sharing) 설정을 추가합니다.
     * (test.html 같은 외부에서의 API 요청을 허용)
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 1. 모든 API 경로(/users/**, /map/** 등)에 대해
                // 2. test.html 파일이 열린 주소(로컬 파일 'null' 또는 Live Server 'http://127.0.0.1:5500')를 허용
                .allowedOrigins("http://127.0.0.1:5500", "null") 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS") // 3. 허용할 HTTP 메소드
                .allowCredentials(true); 
    }
}