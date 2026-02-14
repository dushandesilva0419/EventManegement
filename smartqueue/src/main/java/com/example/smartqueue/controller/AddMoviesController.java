package com.example.smartqueue.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AddMoviesController {

    @GetMapping("/addmovies")
    public String addMoviesPage() {
        return "addmovies";
    }
}