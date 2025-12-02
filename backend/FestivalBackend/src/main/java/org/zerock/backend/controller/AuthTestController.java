package org.zerock.backend.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class AuthTestController {
    // http://Localhost:8080/api/test/Login?userId=testUser
    @GetMapping("/login")
    public String login(@RequestParam(defaultValue = "testUser") String userId, HttpSession session) {
        session.setAttribute("LOGIN_USER_ID", userId);
        return "logged in as" + userId;
    }

    @GetMapping("/whoami")
    public String whoAmI(HttpSession session) {
        Object id = session.getAttribute("LOGIN_USER_ID");
        return "LOGIN_USER_ID = " + id;
    }
}

// 나중에 진짜 로그인 기능을 붙일 때 이 컨트롤러는 삭제하면 됨.
