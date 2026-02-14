package com.example.smartqueue.repository;

import com.example.smartqueue.model.Task;
import com.example.smartqueue.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByDeletedFalse(Pageable pageable);

    Page<Task> findByCreatedByAndDeletedFalse(User user, Pageable pageable);

    Page<Task> findByAssignedToAndDeletedFalse(User user, Pageable pageable);

    Page<Task> findByTitleContainingIgnoreCaseAndDeletedFalse(String title, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.deleted = false " +
            "AND (:status IS NULL OR t.status = :status) " +
            "AND (:priority IS NULL OR t.priority = :priority) " +
            "AND (:assignedToId IS NULL OR t.assignedTo.id = :assignedToId)")
    Page<Task> findByFilters(
            @Param("status") Task.TaskStatus status,
            @Param("priority") Task.TaskPriority priority,
            @Param("assignedToId") Long assignedToId,
            Pageable pageable
    );

    List<Task> findByDueDateBeforeAndStatusNotAndDeletedFalse(
            LocalDateTime date,
            Task.TaskStatus status
    );
}