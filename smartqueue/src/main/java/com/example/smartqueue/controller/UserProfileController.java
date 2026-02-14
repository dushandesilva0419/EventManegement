package com.example.smartqueue.controller;

import com.example.smartqueue.model.User;
import com.example.smartqueue.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class UserProfileController {

    @Autowired
    private UserService userService;

    @GetMapping("/userprofile")
    public String showUserProfile(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user;

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            user = createGuestUser();
        } else {
            user = userService.findByEmail(auth.getName());
            if (user == null) {
                user = createGuestUser();
            } else if (user.getAvatar() == null || user.getAvatar().isEmpty()) {
                user.setAvatar("/images/default-avatar.png");
            }
        }

        model.addAttribute("user", user);
        return "userprofile";
    }

    // Helper method for guest fallback
    private User createGuestUser() {
        User guest = new User();
        guest.setFullName("Guest User");
        guest.setEmail("guest@smartqueue.com");
        guest.setAvatar("/images/default-avatar.png");
        return guest;
    }
}