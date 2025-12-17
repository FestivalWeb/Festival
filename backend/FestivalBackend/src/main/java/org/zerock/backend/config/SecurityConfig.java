package org.zerock.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; 
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. CSRF 해제 (POST 요청 403 방지)
            .csrf(AbstractHttpConfigurer::disable)
            
            // 2. 인증 없이 접근 가능한 주소 설정
            .authorizeHttpRequests(auth -> auth
                // [수정됨] "/api/auth/**" -> "/auth/**" 로 변경!
                // AuthController의 @RequestMapping("/auth")와 일치해야 합니다.
                .requestMatchers( "/map/**", "/weather/**", "/auth/**", "/login/**","/**").permitAll()
                .anyRequest().authenticated() // 나머지는 로그인 필요
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

   
}