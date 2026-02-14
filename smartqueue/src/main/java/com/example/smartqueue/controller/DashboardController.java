package com.example.smartqueue.controller;

import com.example.smartqueue.model.User;
import com.example.smartqueue.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    @Autowired
    private UserService userService;

    @GetMapping("/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(userDetails.getUsername());

        model.addAttribute("user", user);
        model.addAttribute("fullName", user.getFullName());
        model.addAttribute("email", user.getEmail());

        return "dashboard";
    }
}