package com.example.smartqueue.service;

import com.example.smartqueue.dto.TaskRequest;
import com.example.smartqueue.exception.ResourceNotFoundException;
import com.example.smartqueue.model.Task;
import com.example.smartqueue.model.User;
import com.example.smartqueue.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    public Page<Task> getAllTasks(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return taskRepository.findByDeletedFalse(pageable);
    }

    public Page<Task> getTasksByFilters(
            Task.TaskStatus status,
            Task.TaskPriority priority,
            Long assignedToId,
            int page, int size, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return taskRepository.findByFilters(status, priority, assignedToId, pageable);
    }

    public Page<Task> searchTasks(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return taskRepository.findByTitleContainingIgnoreCaseAndDeletedFalse(keyword, pageable);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .filter(task -> !task.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    public Task createTask(TaskRequest taskRequest, User creator) {
        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setStatus(taskRequest.getStatus() != null ? taskRequest.getStatus() : Task.TaskStatus.PENDING);
        task.setPriority(taskRequest.getPriority() != null ? taskRequest.getPriority() : Task.TaskPriority.MEDIUM);
        task.setDueDate(taskRequest.getDueDate());
        task.setCreatedBy(creator);

        if (taskRequest.getAssignedToId() != null) {
            User assignedUser = userService.findById(taskRequest.getAssignedToId());
            task.setAssignedTo(assignedUser);
        }

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, TaskRequest taskRequest) {
        Task task = getTaskById(id);

        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());

        if (taskRequest.getStatus() != null) {
            task.setStatus(taskRequest.getStatus());

            if (taskRequest.getStatus() == Task.TaskStatus.COMPLETED && task.getCompletedAt() == null) {
                task.setCompletedAt(LocalDateTime.now());
            }
        }

        if (taskRequest.getPriority() != null) {
            task.setPriority(taskRequest.getPriority());
        }

        task.setDueDate(taskRequest.getDueDate());

        if (taskRequest.getAssignedToId() != null) {
            User assignedUser = userService.findById(taskRequest.getAssignedToId());
            task.setAssignedTo(assignedUser);
        }

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        task.setDeleted(true);
        taskRepository.save(task);
    }

    public Page<Task> getMyTasks(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return taskRepository.findByCreatedByAndDeletedFalse(user, pageable);
    }

    public Page<Task> getAssignedTasks(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return taskRepository.findByAssignedToAndDeletedFalse(user, pageable);
    }
}