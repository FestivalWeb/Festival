package org.zerock.backend.dto;
import lombok.*;

@Getter @Setter
public class PasswordChangeDto {
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}