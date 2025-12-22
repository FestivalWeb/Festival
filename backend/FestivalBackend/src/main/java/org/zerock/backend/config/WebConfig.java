package org.zerock.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths; // [필수] 절대 경로 계산을 위해 추가

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 1. CORS 설정 (SecurityConfig와 통일)
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해 허용 (/api/** 뿐만 아니라 이미지 등 포함)
                .allowedOrigins("http://localhost:3000", "http://localhost:5173") // React(3000), Vite(5173) 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // [중요] PATCH 추가
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true); // 쿠키 및 인증 정보 허용
    }

    // 2. 정적 리소스(이미지) 매핑
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // [핵심] 운영체제(Window/Mac/Linux) 상관없이 'uploads' 폴더의 절대 경로를 찾음
        String uploadPath = Paths.get("uploads").toAbsolutePath().toUri().toString();

        registry.addResourceHandler("/uploads/**") // 브라우저 접근 주소
                .addResourceLocations(uploadPath); // 실제 파일 시스템 경로 연결
    }
}