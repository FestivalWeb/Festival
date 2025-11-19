package org.zerock.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) 
            .authorizeHttpRequests(authz -> authz
                
                // 로그인 경로(/auth/**)를 추가하여 인증 없이 접근 가능하도록 설정
                .requestMatchers("/users/**", "/map/**", "/weather/**", "/auth/**").permitAll() 
               
                .anyRequest().authenticated()
            );
        return http.build();
    }
}