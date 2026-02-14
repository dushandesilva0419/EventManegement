package com.example.smartqueue.repository;

import com.example.smartqueue.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Find events by status
    List<Event> findByStatus(String status);

    // Find events by category
    List<Event> findByCategory(String category);

    // Count events by status
    long countByStatus(String status);
}