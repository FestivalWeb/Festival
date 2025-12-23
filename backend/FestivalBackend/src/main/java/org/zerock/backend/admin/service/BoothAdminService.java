package org.zerock.backend.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.booth.BoothDto;
import org.zerock.backend.entity.Booth;
import org.zerock.backend.repository.BoothRepository;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BoothAdminService {

    private final BoothRepository boothRepository;

    // 1. 전체 목록
    @Transactional(readOnly = true)
    public List<Booth> getAllBooths() {
        return boothRepository.findAll();
    }

    // 2. 부스 생성
    public Long createBooth(BoothDto.CreateRequest request, HttpServletRequest httpRequest) {
        // Long adminId = (Long) httpRequest.getAttribute("loginAdminId"); // 필요 시 주석 해제하여 사용
        
        Booth booth = Booth.builder()
                .title(request.getTitle())
                .context(request.getContext())
                .location(request.getLocation())
                .price(request.getPrice())
                .maxPerson(request.getMaxPerson())
                .eventDate(request.getEventDate())
                .status(false) // .isShow(false) -> .status(false)
                .priority(1L)
                .build();

        Booth savedBooth = boothRepository.save(booth);
        
        // [수정] getBoothId() -> getId() (엔티티 필드명이 id인 경우)
        return savedBooth.getId(); 
    }

    // 3. 부스 정보 수정
    public void updateBooth(Long boothId, BoothDto.CreateRequest request) {
        Booth booth = boothRepository.findById(boothId)
                .orElseThrow(() -> new IllegalArgumentException("부스 없음"));

        // [주의] Booth 엔티티의 updateInfo 메서드 매개변수 순서와 정확히 일치해야 합니다.
        // 만약 에러가 난다면 Booth.java의 updateInfo 메서드를 확인하고 순서를 맞춰주세요.
        booth.updateInfo(
            request.getTitle(),
            request.getContext(),
            request.getLocation(),
            request.getMaxPerson(),
            1L, // priority
            request.getEventDate(),
            request.getPrice()
        );
    }

    // 4. 상태 변경
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