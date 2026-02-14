package com.example.smartqueue.controller;

import com.example.smartqueue.model.Movie;
import com.example.smartqueue.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BookTicketController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/booktickets")
    public String bookTicketsPage(Model model) {
        model.addAttribute("dbMovies", movieService.getMoviesByCategory("MOVIE"));
        model.addAttribute("dbStageDramas", movieService.getMoviesByCategory("STAGE_DRAMA"));
        model.addAttribute("dbMusicals", movieService.getMoviesByCategory("MUSICAL"));
        return "booktickets";
    }
}