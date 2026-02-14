package com.example.smartqueue.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ContactUsforEventController {

    @GetMapping("/contactusforevent")
    public String contactusforeventPage() {
        return "contactusforevent";
    }
}