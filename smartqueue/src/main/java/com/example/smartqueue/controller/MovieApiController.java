package com.example.smartqueue.controller;

import com.example.smartqueue.model.Movie;
import com.example.smartqueue.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
public class MovieApiController {

    @Autowired
    private MovieService movieService;

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllActiveMovies());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Movie>> getMoviesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(movieService.getMoviesByCategory(category));
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadMovie(
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("image") MultipartFile image) {

        try {
            String imagePath = movieService.saveImage(image);

            Movie movie = new Movie();
            movie.setTitle(title);
            movie.setCategory(category);
            movie.setDescription(description);
            movie.setImage(imagePath);
            movie.setStatus("ACTIVE");

            Movie saved = movieService.saveMovie(movie);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Movie added successfully");
            response.put("movie", saved);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteMovie(@PathVariable Long id) {
        try {
            movieService.deleteMovie(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Movie deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}