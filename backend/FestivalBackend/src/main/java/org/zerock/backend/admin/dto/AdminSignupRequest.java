package org.zerock.backend.admin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AdminSignupRequest {

    private String username;
    private String name;
    private String password;
    private String email;
}
