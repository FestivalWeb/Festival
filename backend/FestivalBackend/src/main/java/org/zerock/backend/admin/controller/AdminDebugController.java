package org.zerock.backend.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/debug")
@RequiredArgsConstructor
public class AdminDebugController {

    private final PasswordEncoder passwordEncoder;

    @GetMapping("/encode")
    public String encode(@RequestParam String raw) {
        return passwordEncoder.encode(raw);
    }
}