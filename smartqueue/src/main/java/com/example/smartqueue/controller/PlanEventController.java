package com.example.smartqueue.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PlanEventController {

    @GetMapping("/planevent")
    public String planeventPage() {
        return "planevent";
    }
}