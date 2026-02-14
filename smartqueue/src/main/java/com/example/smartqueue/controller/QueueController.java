package com.example.smartqueue.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class QueueController {

    @GetMapping("/queue")
    public String queuePage() {
        return "queue"; // queue.html
    }
}
