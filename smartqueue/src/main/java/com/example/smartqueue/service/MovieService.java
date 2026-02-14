package com.example.smartqueue.service;

import com.example.smartqueue.model.Movie;
import com.example.smartqueue.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    private static final String UPLOAD_DIR = "src/main/resources/static/images/movies/";

    public List<Movie> getAllActiveMovies() {
        return movieRepository.findByStatus("ACTIVE");
    }

    public List<Movie> getMoviesByCategory(String category) {
        return movieRepository.findByCategoryAndStatus(category, "ACTIVE");
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public String saveImage(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = UUID.randomUUID().toString() + extension;

        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/images/movies/" + filename;
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id).orElse(null);
    }
}