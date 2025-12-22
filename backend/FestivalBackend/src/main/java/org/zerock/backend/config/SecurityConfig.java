package org.zerock.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; 
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. CORS 설정 적용 (하단 corsConfigurationSource 메서드 사용)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. CSRF 비활성화 (POST, PUT, DELETE 등 데이터 변경 요청 허용을 위해 필수)
            .csrf(AbstractHttpConfigurer::disable)
            
            // 3. 인증 규칙 설정
            .authorizeHttpRequests(auth -> auth
                // 개발 및 테스트 편의를 위해 모든 경로("/**")에 대해 접근 허용
                // 추후 배포 시에는 .requestMatchers("/admin/**").hasRole("ADMIN") 등으로 보안 강화 필요
                .requestMatchers("/**").permitAll()
            );

        return http.build();
    }

    /**
     * CORS 설정 빈 (Bean)
     * 프론트엔드(localhost:3000 및 5173)에서 오는 모든 요청을 허용합니다.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // [핵심] React(3000)와 Vite(5173) 포트 모두 허용
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
        
        // [핵심] 허용할 HTTP 메서드 (PUT, DELETE, PATCH 포함 필수)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // 모든 헤더 허용
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // 자격 증명(쿠키, 세션 등) 허용
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}