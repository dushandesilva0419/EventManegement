package com.example.smartqueue.controller;

import com.example.smartqueue.model.Event;
import com.example.smartqueue.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    // Directory where images will be saved
    private static final String UPLOAD_DIR = "src/main/resources/static/images/events/";

    // ============================================
    // GET ALL EVENTS
    // ============================================
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return ResponseEntity.ok(events);
    }

    // ============================================
    // GET EVENT BY ID
    // ============================================
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================
    // CREATE EVENT
    // ============================================
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        try {
            // Set default values
            if (event.getSoldTickets() == null) {
                event.setSoldTickets(0);
            }
            if (event.getStatus() == null) {
                event.setStatus("active");
            }

            Event savedEvent = eventRepository.save(event);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ============================================
    // UPDATE EVENT
    // ============================================
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        try {
            Event existing = eventRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

            // Update fields
            existing.setTitle(event.getTitle());
            existing.setCategory(event.getCategory());
            existing.setDescription(event.getDescription());
            existing.setLocation(event.getLocation());
            existing.setDatetime(event.getDatetime());
            existing.setTotalTickets(event.getTotalTickets());
            existing.setPrice(event.getPrice());

            // Don't overwrite image unless explicitly provided
            if (event.getImage() != null && !event.getImage().isEmpty()) {
                existing.setImage(event.getImage());
            }

            Event updatedEvent = eventRepository.save(existing);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ============================================
    // DELETE EVENT
    // ============================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable Long id) {
        try {
            Event event = eventRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            // Delete image file if exists
            if (event.getImage() != null && !event.getImage().isEmpty()) {
                deleteImageFile(event.getImage());
            }

            eventRepository.delete(event);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Event deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ============================================
    // UPLOAD IMAGE (CRITICAL ENDPOINT!)
    // ============================================
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image) {

        try {
            // Validate file
            if (image.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "No file provided");
                return ResponseEntity.badRequest().body(error);
            }

            // Validate file type
            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Only image files are allowed");
                return ResponseEntity.badRequest().body(error);
            }

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = image.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Create image URL path (this is what gets saved to database)
            String imagePath = "/images/events/" + filename;

            // Update event with image path
            Event event = eventRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            // Delete old image if exists
            if (event.getImage() != null && !event.getImage().isEmpty()) {
                deleteImageFile(event.getImage());
            }

            // Save new image path to database
            event.setImage(imagePath);
            eventRepository.save(event);

            // Return success response
            Map<String, String> response = new HashMap<>();
            response.put("imagePath", imagePath);
            response.put("message", "Image uploaded successfully");
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Event not found");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ============================================
    // SEARCH EVENTS
    // ============================================
    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEvents(@RequestParam String keyword) {
        try {
            List<Event> events = eventRepository.findAll().stream()
                    .filter(event ->
                            event.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                                    event.getCategory().toLowerCase().contains(keyword.toLowerCase()) ||
                                    event.getLocation().toLowerCase().contains(keyword.toLowerCase())
                    )
                    .toList();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ============================================
    // HELPER METHOD: DELETE IMAGE FILE
    // ============================================
    private void deleteImageFile(String imagePath) {
        try {
            if (imagePath != null && imagePath.startsWith("/images/events/")) {
                String filename = imagePath.substring("/images/events/".length());
                Path filePath = Paths.get(UPLOAD_DIR + filename);
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            // Log error but don't throw exception
            System.err.println("Failed to delete image: " + imagePath);
        }
    }
}