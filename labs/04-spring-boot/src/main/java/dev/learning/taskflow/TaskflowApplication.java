package dev.learning.taskflow;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * TaskFlow sobre Spring Boot.
 *
 * <p>Mismo contrato, mismas pruebas de aceptación. Lo que revela la comparación
 * con la referencia es dónde vive el riesgo en un framework estructurado: casi
 * todo el comportamiento por omisión es correcto, pero traducir sus excepciones
 * al catálogo del contrato exige un punto único —el {@code @RestControllerAdvice}—
 * y olvidar una excepción significa filtrar el formato interno del framework.
 *
 * <p><b>Desviación declarada del contrato:</b> el límite de 64 KiB se comprueba
 * después de que el contenedor haya leído el cuerpo, no mientras llega como en la
 * referencia. El código de respuesta es el mismo; la protección de memoria, no.
 */
@SpringBootApplication
public class TaskflowApplication {
  public static void main(String[] args) {
    SpringApplication.run(TaskflowApplication.class, args);
  }
}

final class Contrato {
  static final int TITLE_MAX = 120;
  static final int MAX_BODY_BYTES = 64 * 1024;
  static final String PROBLEM_BASE =
      "https://vladimiracunadev-create.github.io/framework-ecosystems-labs/problems";

  static final Map<String, Map.Entry<Integer, String>> CATALOGO = Map.ofEntries(
      Map.entry("IDEMPOTENCY_KEY_REQUIRED", Map.entry(400, "Idempotency key required")),
      Map.entry("MALFORMED_JSON", Map.entry(400, "Malformed JSON")),
      Map.entry("TASK_NOT_FOUND", Map.entry(404, "Task not found")),
      Map.entry("ROUTE_NOT_FOUND", Map.entry(404, "Route not found")),
      Map.entry("METHOD_NOT_ALLOWED", Map.entry(405, "Method not allowed")),
      Map.entry("IDEMPOTENCY_KEY_REUSED", Map.entry(409, "Idempotency key reused")),
      Map.entry("BODY_TOO_LARGE", Map.entry(413, "Body too large")),
      Map.entry("UNSUPPORTED_MEDIA_TYPE", Map.entry(415, "Unsupported media type")),
      Map.entry("VALIDATION_ERROR", Map.entry(422, "Validation error")),
      Map.entry("INTERNAL_ERROR", Map.entry(500, "Internal error")));

  private Contrato() {}

  /** Punto único de construcción de errores: si cada rama los armara, una filtraría el interior. */
  static ResponseEntity<Map<String, Object>> problem(
      String code, String detail, String instance, List<Map<String, String>> errors, HttpHeaders headers) {
    var entrada = CATALOGO.getOrDefault(code, CATALOGO.get("INTERNAL_ERROR"));
    int status = entrada.getKey();
    Map<String, Object> cuerpo = new LinkedHashMap<>();
    cuerpo.put("type", PROBLEM_BASE + "/" + code.toLowerCase(Locale.ROOT).replace('_', '-'));
    cuerpo.put("title", entrada.getValue());
    cuerpo.put("status", status);
    cuerpo.put("code", code);
    if (detail != null) cuerpo.put("detail", detail);
    if (instance != null) cuerpo.put("instance", instance);
    if (errors != null && !errors.isEmpty()) cuerpo.put("errors", errors);

    HttpHeaders cabeceras = headers == null ? new HttpHeaders() : headers;
    cabeceras.setContentType(MediaType.APPLICATION_PROBLEM_JSON);
    return ResponseEntity.status(status).headers(cabeceras).body(cuerpo);
  }

  static ResponseEntity<Map<String, Object>> problem(String code, String instance) {
    return problem(code, null, instance, null, null);
  }

  static Map<String, String> campo(String field, String code, String detail) {
    return Map.of("field", field, "code", code, "detail", detail);
  }
}

@RestController
class TaskController {
  private final Map<String, Task> tasks = new LinkedHashMap<>();
  private final Map<String, Registro> idempotency = new ConcurrentHashMap<>();
  private final AtomicInteger sequence = new AtomicInteger(1);
  private final ObjectMapper mapper = new ObjectMapper();

  record Registro(Task task, String fingerprint) {}

  @GetMapping("/health")
  Map<String, String> health() {
    return Map.of("status", "ok");
  }

  @GetMapping("/tasks")
  Map<String, Object> list() {
    return Map.of("items", new ArrayList<>(tasks.values()));
  }

  @GetMapping("/tasks/{taskId}")
  ResponseEntity<?> get(@PathVariable String taskId) {
    Task task = tasks.get(taskId);
    if (task == null) return Contrato.problem("TASK_NOT_FOUND", "/tasks/" + taskId);
    return ResponseEntity.ok(task);
  }

  /**
   * El cuerpo se recibe como texto y no como objeto enlazado. Es deliberado: el
   * contrato fija el ORDEN de las comprobaciones —tamaño, clave, análisis,
   * idempotencia, validación— y el enlace automático analizaría antes de que la
   * clave de idempotencia se haya mirado siquiera.
   */
  @PostMapping(path = "/tasks", consumes = MediaType.APPLICATION_JSON_VALUE)
  ResponseEntity<?> create(
      @RequestHeader(value = "Idempotency-Key", required = false) String key,
      @RequestBody(required = false) String raw) {

    String cuerpo = raw == null ? "" : raw;
    if (cuerpo.getBytes(StandardCharsets.UTF_8).length > Contrato.MAX_BODY_BYTES) {
      return Contrato.problem("BODY_TOO_LARGE", "/tasks");
    }

    String clave = key == null ? "" : key.trim();
    if (clave.isEmpty()) {
      return Contrato.problem(
          "IDEMPOTENCY_KEY_REQUIRED",
          "POST is not idempotent: send a client-generated Idempotency-Key",
          "/tasks",
          null,
          null);
    }

    JsonNode entrada;
    try {
      entrada = cuerpo.isBlank() ? mapper.createObjectNode() : mapper.readTree(cuerpo);
    } catch (Exception error) {
      return Contrato.problem("MALFORMED_JSON", "/tasks");
    }

    String huella = entrada.toString();
    Registro previo = idempotency.get(clave);
    if (previo != null) {
      if (!previo.fingerprint().equals(huella)) {
        return Contrato.problem(
            "IDEMPOTENCY_KEY_REUSED",
            "The key was already used with a different request body",
            "/tasks",
            null,
            null);
      }
      return ResponseEntity.ok(previo.task());
    }

    List<Map<String, String>> errores = validar(entrada);
    if (!errores.isEmpty()) {
      return Contrato.problem(
          "VALIDATION_ERROR", "The request body failed validation", "/tasks", errores, null);
    }

    Task task = new Task(
        "task-" + sequence.getAndIncrement(),
        entrada.get("title").asText().trim(),
        false,
        Instant.now().toString());
    tasks.put(task.id(), task);
    idempotency.put(clave, new Registro(task, huella));
    return ResponseEntity.created(URI.create("/tasks/" + task.id())).body(task);
  }

  /** Misma regla que la referencia: el error nombra el campo para que la interfaz pueda señalarlo. */
  private List<Map<String, String>> validar(JsonNode entrada) {
    List<Map<String, String>> errores = new ArrayList<>();
    if (entrada == null || !entrada.isObject()) {
      errores.add(Contrato.campo("", "BODY_NOT_OBJECT", "The body must be a JSON object"));
      return errores;
    }
    JsonNode title = entrada.get("title");
    if (title == null || !title.isTextual()) {
      errores.add(Contrato.campo("title", "TITLE_REQUIRED", "title is required and must be a string"));
    } else {
      String valor = title.asText().trim();
      if (valor.isEmpty()) {
        errores.add(Contrato.campo("title", "TITLE_EMPTY", "title must not be blank"));
      } else if (valor.length() > Contrato.TITLE_MAX) {
        errores.add(
            Contrato.campo("title", "TITLE_TOO_LONG", "title must not exceed " + Contrato.TITLE_MAX + " characters"));
      }
    }
    return errores;
  }
}

/** Traductor único de las excepciones del framework al catálogo del contrato. */
@RestControllerAdvice
class TraductorDeErrores {

  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  ResponseEntity<?> metodo(HttpRequestMethodNotSupportedException error) {
    HttpHeaders cabeceras = new HttpHeaders();
    var permitidos = error.getSupportedHttpMethods();
    // Un 405 sin Allow deja al cliente adivinando qué método sí vale.
    cabeceras.set(HttpHeaders.ALLOW, permitidos == null || permitidos.isEmpty()
        ? "GET"
        : String.join(", ", permitidos.stream().map(Object::toString).sorted().toList()));
    return Contrato.problem("METHOD_NOT_ALLOWED", null, null, null, cabeceras);
  }

  @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
  ResponseEntity<?> medio(HttpMediaTypeNotSupportedException error) {
    return Contrato.problem(
        "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json", "/tasks", null, null);
  }

  @ExceptionHandler({NoHandlerFoundException.class, NoResourceFoundException.class})
  ResponseEntity<?> ruta(Exception error) {
    return Contrato.problem("ROUTE_NOT_FOUND", null);
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<?> resto(Exception error) {
    // El detalle se queda en el registro del servidor, nunca en la respuesta.
    return Contrato.problem("INTERNAL_ERROR", null);
  }
}

record Task(String id, String title, boolean completed, String createdAt) {}
