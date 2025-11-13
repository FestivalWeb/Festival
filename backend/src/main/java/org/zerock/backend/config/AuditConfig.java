// src/main/java/org/zerock/backend/config/AuditConfig.java

package org.zerock.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication; // Spring Security 사용 시
import org.springframework.security.core.context.SecurityContextHolder; // Spring Security 사용 시

import java.util.Optional;

@Configuration
@EnableJpaAuditing // JPA Auditing 활성화
public class AuditConfig {

    @Bean
    public AuditorAware<Long> auditorProvider() {
        // Spring Security의 인증 정보에서 현재 사용자 ID(Long)를 가져오는 람다식
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
                // 로그인하지 않은 사용자일 경우 (ex: 시스템 배치)
                // 혹은 스키마에 따라 null을 허용하지 않으므로, 시스템 관리자 ID(예: 1L) 등을 반환
                return Optional.of(1L); // TODO: 정책에 맞게 수정
            }

            // (가정) Spring Security의 UserDetails 구현체가 사용자의 ID를 Long 타입으로 반환
            // 예: UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            // return Optional.of(principal.getId());

            // 임시로 하드코딩 (Spring Security 연동 전)
            // TODO: 실제 Spring Security 연동 후 위 주석처럼 수정 필요
            return Optional.of(1L); 
        };
    }
}