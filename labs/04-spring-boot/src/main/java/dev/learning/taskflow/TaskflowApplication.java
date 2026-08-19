package dev.learning.taskflow;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
public class TaskflowApplication {
  public static void main(String[] args) { SpringApplication.run(TaskflowApplication.class, args); }
}

@RestController
class TaskController {
  private final Map<String, Task> tasks = new LinkedHashMap<>();
  private final Map<String, Task> idempotency = new LinkedHashMap<>();
  private final AtomicInteger sequence = new AtomicInteger(1);

  @GetMapping("/health") Map<String, String> health() { return Map.of("status", "ok"); }
  @GetMapping("/tasks") Map<String, Object> list() { return Map.of("items", new ArrayList<>(tasks.values())); }

  @PostMapping("/tasks") ResponseEntity<?> create(@RequestHeader(value = "Idempotency-Key", required = false) String key, @RequestBody CreateTask input) {
    if (key == null || key.isBlank()) return ResponseEntity.badRequest().body(problem("IDEMPOTENCY_KEY_REQUIRED", "Idempotency-Key is required"));
    if (idempotency.containsKey(key)) return ResponseEntity.ok(idempotency.get(key));
    String title = input.title() == null ? "" : input.title().trim();
    if (title.isEmpty() || title.length() > 120) return ResponseEntity.unprocessableEntity().body(problem("VALIDATION_ERROR", "Title must contain 1 to 120 characters"));
    Task task = new Task("task-" + sequence.getAndIncrement(), title, false, Instant.now().toString());
    tasks.put(task.id(), task); idempotency.put(key, task);
    return ResponseEntity.status(201).body(task);
  }

  private Map<String, Object> problem(String code, String message) { return Map.of("error", Map.of("code", code, "message", message)); }
}

record CreateTask(String title) {}
record Task(String id, String title, boolean completed, String createdAt) {}
