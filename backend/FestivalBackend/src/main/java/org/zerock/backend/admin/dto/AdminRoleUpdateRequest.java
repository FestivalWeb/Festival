package org.zerock.backend.admin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AdminRoleUpdateRequest {

    private String roleCode;  // "SUPER" | "MANAGER" | "STAFF"
}
