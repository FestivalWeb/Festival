package org.zerock.backend.admin.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class AdminMeResponse {
    private Long adminId;
    private String username;
    private String name;
    private List<String> roles; // 예: ["SUPER", "MANAGER"]
}