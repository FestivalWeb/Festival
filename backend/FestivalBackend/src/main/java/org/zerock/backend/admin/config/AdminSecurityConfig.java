package org.zerock.backend.admin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@Order(1) // ★ 핵심 1: 사용자 설정보다 먼저 실행되어야 함
public class AdminSecurityConfig { // ★ 핵심 2: 클래스 이름 변경 (SecurityConfig -> AdminSecurityConfig)

    // 메인 SecurityConfig에 있는 CORS 설정을 주입받음
    private final CorsConfigurationSource corsConfigurationSource;

    public AdminSecurityConfig(CorsConfigurationSource corsConfigurationSource) {
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http) throws Exception {

        http
                // ★ 핵심 3: 이 설정은 "/api/admin/**" 으로 시작하는 주소만 담당한다!
                .securityMatcher("/api/admin/**")

                // ★ 핵심 4: CORS 적용 (이거 없으면 관리자 프론트에서 에러 남)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/admin/auth/login", "/api/admin/auth/signup").permitAll()
                        .anyRequest().permitAll() // 일단 다 허용 (추후 필터 적용 시 authenticated()로 변경 가능)
                );

        return http.build();
    }
}