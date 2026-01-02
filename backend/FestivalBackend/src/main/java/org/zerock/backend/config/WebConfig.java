package org.zerock.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 1. CORS 설정 (Spring MVC 레벨)
    // SecurityConfig의 설정과 별개로 작동하며, 이중으로 허용해두면 더 안전합니다.
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    // 2. 정적 리소스(이미지) 경로 매핑
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // 'uploads' 폴더의 절대 경로를 URL로 매핑
        String uploadPath = Paths.get("uploads").toAbsolutePath().toUri().toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath)
                .addResourceLocations("file:///C:/gnsdlxx-admin/uploads/");
    }

    // [삭제함] corsConfigurationSource 빈은 SecurityConfig에 이미 있으므로 제거하여 충돌 방지
}