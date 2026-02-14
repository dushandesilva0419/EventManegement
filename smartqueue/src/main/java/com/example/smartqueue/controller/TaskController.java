package com.example.smartqueue.controller;

import com.example.smartqueue.dto.MessageResponse;
import com.example.smartqueue.dto.TaskRequest;
import com.example.smartqueue.model.Task;
import com.example.smartqueue.model.User;
import com.example.smartqueue.service.TaskService;
import com.example.smartqueue.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<Page<Task>> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Page<Task> tasks = taskService.getAllTasks(page, size, sortBy, sortDir);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Task>> getTasksByFilters(
            @RequestParam(required = false) Task.TaskStatus status,
            @RequestParam(required = false) Task.TaskPriority priority,
            @RequestParam(required = false) Long assignedToId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Page<Task> tasks = taskService.getTasksByFilters(status, priority, assignedToId, page, size, sortBy, sortDir);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Task>> searchTasks(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Task> tasks = taskService.searchTasks(keyword, page, size);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<?> createTask(
            @Valid @RequestBody TaskRequest taskRequest,
            Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User creator = userService.findByEmail(userDetails.getUsername());

        Task task = taskService.createTask(taskRequest, creator);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest taskRequest) {

        Task updated = taskService.updateTask(id, taskRequest);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(new MessageResponse("Task deleted successfully"));
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<Page<Task>> getMyTasks(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(userDetails.getUsername());

        Page<Task> tasks = taskService.getMyTasks(user, page, size);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/assigned-to-me")
    public ResponseEntity<Page<Task>> getAssignedTasks(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(userDetails.getUsername());

        Page<Task> tasks = taskService.getAssignedTasks(user, page, size);
        return ResponseEntity.ok(tasks);
    }
}