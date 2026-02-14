package com.example.smartqueue.controller;

import com.example.smartqueue.model.User;
import com.example.smartqueue.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardEventController {

    @Autowired
    private UserService userService;

    @GetMapping("/dashboardevent")
    public String dashboardeventPage(Model model) {
        try {
            // Get logged-in user's email
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            // Get user from database
            User user = userService.findByEmailSafe(email);

            if (user != null) {
                model.addAttribute("userName", user.getFullName());
                model.addAttribute("userEmail", user.getEmail());
                model.addAttribute("userRole", user.isEnabled() ? "Admin" : "User");

                String initial = user.getFullName().substring(0, 1).toUpperCase();
                model.addAttribute("userInitial", initial);
            } else {
                model.addAttribute("userName", "Guest");
                model.addAttribute("userRole", "User");
                model.addAttribute("userInitial", "G");
            }
        } catch (Exception e) {
            model.addAttribute("userName", "Guest");
            model.addAttribute("userRole", "User");
            model.addAttribute("userInitial", "G");
        }

        return "dashboardevent";
    }
}