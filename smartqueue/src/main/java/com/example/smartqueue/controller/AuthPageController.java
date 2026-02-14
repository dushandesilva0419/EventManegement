package com.example.smartqueue.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AuthPageController {

    @GetMapping("/signup")
    public String signupPage() {
        return "signup"; // src/main/resources/templates/signup.html
    }

    @GetMapping("/login")
    public String loginPage(
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "logout", required = false) String logout,
            Model model
    ) {
        if (error != null) {
            model.addAttribute("error", "Invalid email or password");
        }
        if (logout != null) {
            model.addAttribute("message", "Logged out successfully");
        }
        return "login"; // src/main/resources/templates/login.html
    }
}
