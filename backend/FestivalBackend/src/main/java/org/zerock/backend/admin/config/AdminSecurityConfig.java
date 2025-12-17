package org.zerock.backend.admin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Order(1)
public class AdminSecurityConfig {

    @Bean
    public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http) throws Exception {

        http
                .securityMatcher("/api/admin/**")
                // CSRF는 일단 개발 단계에서는 꺼두자 (나중에 필요하면 다시 켜기)
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // 우리가 만든 관리자 로그인 API는 모두 허용
                        .requestMatchers("/api/admin/auth/login").permitAll()
                        .requestMatchers("/api/admin/auth/signup").permitAll()
                        // 나머지도 일단 전부 허용 (관리자 인증 필터 만들고 나서 바꾸자)
                        .anyRequest().permitAll()
                );

        // 기본 로그인폼/HTTP Basic 로그인 비활성화해도 됨 (선택)
        // .formLogin(login -> login.disable())
        // .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
