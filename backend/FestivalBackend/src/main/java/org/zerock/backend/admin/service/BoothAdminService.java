package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.booth.BoothDto;
import org.zerock.backend.entity.AdminUser;
import org.zerock.backend.entity.Booth;
import org.zerock.backend.repository.AdminUserRepository;
import org.zerock.backend.repository.BoothRepository;
import jakarta.servlet.http.HttpServletRequest; // request 사용 시

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BoothAdminService {

    private final BoothRepository boothRepository;
    private final AdminUserRepository adminUserRepository;

    // 1. 전체 목록 (관리자용 - 숨겨진 것도 다 보임)
    @Transactional(readOnly = true)
    public List<Booth> getAllBooths() {
        return boothRepository.findAll();
    }

    // 2. 부스 생성 (초기 상태: 비공개)
    public Long createBooth(BoothDto.CreateRequest request, HttpServletRequest httpRequest) {
        // 로그인 관리자 ID 찾기 (기존 로직 활용)
        Long adminId = (Long) httpRequest.getAttribute("loginAdminId"); 
        
        Booth booth = Booth.builder()
                .title(request.getTitle())
                .context(request.getContext())
                .location(request.getLocation())
                .price(request.getPrice())
                .maxPerson(request.getMaxPerson())
                .eventDate(request.getEventDate())
                .isShow(false)   // [핵심] 일단 숨김 상태로 생성
                .priority(1L)    // 기본 우선순위
                .createdBy(adminId)
                .build();

        // (이미지 처리 로직은 기존 Service 참고해서 추가 필요)

        return boothRepository.save(booth).getId();
    }

    // 3. 부스 정보 수정
    public void updateBooth(Long boothId, BoothDto.CreateRequest request) { // DTO 재활용
        Booth booth = boothRepository.findById(boothId)
                .orElseThrow(() -> new IllegalArgumentException("부스 없음"));

        booth.updateInfo(
            request.getTitle(),
            request.getContext(),
            request.getLocation(),
            request.getPrice(),
            request.getMaxPerson(),
            request.getEventDate(),
            1L // 우선순위는 나중에 DTO에 추가해서 받으세요
        );
    }

    // 4. [핵심] 상태 변경 (공개/비공개 토글)
    public void toggleStatus(Long boothId, boolean isShow) {
        Booth booth = boothRepository.findById(boothId)
                .orElseThrow(() -> new IllegalArgumentException("부스 없음"));
        booth.changeStatus(isShow);
    }

    // 5. 삭제
    public void deleteBooth(Long boothId) {
        boothRepository.deleteById(boothId);
    }
}