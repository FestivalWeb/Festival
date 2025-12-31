package org.zerock.backend.admin.controller;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.backend.entity.SystemLogEntity;
import org.zerock.backend.repository.SystemLogRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/logs")
@RequiredArgsConstructor
public class AdminLogController {

    // [중요] 시스템 로그를 보려면 SystemLogRepository를 써야 합니다.
    private final SystemLogRepository systemLogRepository;

    @GetMapping
    public ResponseEntity<List<LogResponse>> getLogs(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String keyword
    ) {
        List<SystemLogEntity> entities;

        // 1. 날짜 범위 검색 (없으면 최근 30일 or 전체)
        if (startDate != null || endDate != null) {
            LocalDateTime start = (startDate != null) ? startDate.atStartOfDay() : LocalDate.now().minusDays(30).atStartOfDay();
            LocalDateTime end = (endDate != null) ? endDate.atTime(23, 59, 59) : LocalDateTime.now();
            
            // SystemLogRepository에 해당 메서드가 없다면 추가가 필요합니다. (아래 참고)
            entities = systemLogRepository.findByOccurredAtBetweenOrderByOccurredAtDesc(start, end);
        } else {
            // 날짜 없으면 최근 100개
            entities = systemLogRepository.findTop100ByOrderByOccurredAtDesc();
        }

        // 2. 메모리 내 필터링 (유형 및 검색어)
        List<LogResponse> dtos = entities.stream()
            .filter(log -> {
                // 유형(Level) 필터
                if (StringUtils.hasText(type) && !"ALL".equals(type)) {
                    if (log.getLevel() != null && !type.equals(log.getLevel().name())) return false;
                }
                // 검색어 필터
                if (StringUtils.hasText(keyword)) {
                    String lowerKey = keyword.toLowerCase();
                    String msg = (log.getMessage() != null) ? log.getMessage().toLowerCase() : "";
                    String ip = (log.getIpAddress() != null) ? log.getIpAddress().toLowerCase() : "";
                    return msg.contains(lowerKey) || ip.contains(lowerKey);
                }
                return true;
            })
            .map(log -> LogResponse.builder()
                    .actLogId(log.getSysLogId())
                    .occurredAt(log.getOccurredAt().toString())
                    .actionType(log.getLevel() != null ? log.getLevel().name() : "INFO")
                    .message(log.getMessage())
                    .ipAddress(log.getIpAddress())
                    .username("System") // 시스템 로그는 유저명이 따로 없는 경우가 많음
                    .build())
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @Getter
    @Builder
    public static class LogResponse {
        private Long actLogId;
        private String occurredAt;
        private String actionType;
        private String message;
        private String ipAddress;
        private String username;
    }
}   