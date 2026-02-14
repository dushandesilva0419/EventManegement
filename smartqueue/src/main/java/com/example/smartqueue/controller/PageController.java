package com.example.smartqueue.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/signup-page")
    public String signup() {
        return "signup-page";
    }

    @GetMapping("/ticket")
    public String ticket() {
        return "ticket";
    }

}