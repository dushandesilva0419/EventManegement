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
public class AdminDashboardController {

    @Autowired
    private UserService userService;

    @GetMapping("/admindashboard")
    public String admindashboardPage(Model model) {
        try {
            // Get logged-in user's email from Spring Security
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            System.out.println("Logged in user email: " + email); // DEBUG

            // Get user from database
            User user = userService.findByEmail(email);

            System.out.println("User found: " + user.getFullName()); // DEBUG

            // Pass user data to template
            model.addAttribute("userName", user.getFullName());
            model.addAttribute("userEmail", user.getEmail());
            model.addAttribute("userRole", user.isEnabled() ? "Admin" : "User");

            // Get first letter for avatar
            String initial = user.getFullName() != null && !user.getFullName().isEmpty()
                    ? String.valueOf(user.getFullName().charAt(0)).toUpperCase()
                    : "U";
            model.addAttribute("userInitial", initial);

        } catch (Exception e) {
            // Print error for debugging
            System.out.println("ERROR: " + e.getMessage());
            e.printStackTrace();

            // Fallback if user not found
            model.addAttribute("userName", "Guest");
            model.addAttribute("userRole", "User");
            model.addAttribute("userInitial", "G");
        }

        return "admindashboard";
    }
}