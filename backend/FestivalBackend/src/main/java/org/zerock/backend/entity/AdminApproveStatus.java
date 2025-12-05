package org.zerock.backend.entity;

public enum AdminApproveStatus {
    PENDING,   // 가입 요청만 된 상태
    APPROVED,  // SUPER가 승인한 상태
    REJECTED,  // SUPER가 가입 거절한 상태
    BLOCKED    // 나중에 정지 같은 거에도 쓸 수 있음
}