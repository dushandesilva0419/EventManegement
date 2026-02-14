package com.example.smartqueue.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller for handling welcome page and navigation
 */
@Controller
public class WelcomeController {

    /**
     * Display the welcome page after user login
     * This should be shown after successful authentication
     */
    @GetMapping("/welcome")
    public String showWelcomePage() {
        return "welcome";  // Returns welcome.html template
    }

    /**
     * Redirect to book tickets page
     */


    /**
     * Redirect to plan event page
     */
    @GetMapping("/plan-event")
    public String planEvent() {
        return "events/plan";  // Create this template for planning events
    }
}