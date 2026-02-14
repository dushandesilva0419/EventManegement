package com.example.smartqueue.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TicketController {

    @GetMapping("/ticket/manage")
    public String ticketPage() {
        return "ticket";
    }
}