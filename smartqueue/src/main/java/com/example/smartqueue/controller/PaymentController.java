package com.example.smartqueue.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Controller
public class PaymentController {

    // Loads payment page
    @GetMapping("/payment")
    public String paymentPage() {
        return "payment";
    }

    // Handles payment processing
    @PostMapping("/api/payments/process")
    @ResponseBody
    public Map<String, Object> processPayment(@RequestBody Map<String, Object> paymentData) {

        // Fake payment logic
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("bookingId", UUID.randomUUID().toString().substring(0, 8));

        return response;
    }
}