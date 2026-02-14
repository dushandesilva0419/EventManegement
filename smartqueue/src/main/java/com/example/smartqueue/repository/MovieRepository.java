package com.example.smartqueue.repository;

import com.example.smartqueue.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByCategory(String category);
    List<Movie> findByStatus(String status);
    List<Movie> findByCategoryAndStatus(String category, String status);
}