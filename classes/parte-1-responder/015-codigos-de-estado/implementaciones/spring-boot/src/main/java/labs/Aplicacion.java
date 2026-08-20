package labs;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    private final Map<String, Map<String, String>> tareas = new HashMap<>(
            Map.of("1", Map.of("id", "1", "titulo", "original")));
    private final AtomicInteger siguiente = new AtomicInteger(100);

    // `ResponseEntity.created(uri)` pone a la vez el 201 y la cabecera Location:
    // el tipo hace difícil olvidarse de una de las dos.
    @PostMapping("/tareas")
    public ResponseEntity<Map<String, String>> crear(
            @RequestBody(required = false) Map<String, Object> cuerpo) {
        String id = String.valueOf(siguiente.getAndIncrement());
        Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
        tareas.put(id, Map.of("id", id, "titulo", titulo == null ? "" : titulo.toString()));
        return ResponseEntity.created(URI.create("/tareas/" + id)).body(Map.of("id", id));
    }

    @DeleteMapping("/tareas/{id}")
    public ResponseEntity<Object> borrar(@PathVariable("id") String id) {
        if (tareas.remove(id) == null) {
            return ResponseEntity.status(404).body(Map.of("error", "no existe"));
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tareas/{id}")
    public ResponseEntity<Object> obtener(@PathVariable("id") String id) {
        Map<String, String> tarea = tareas.get(id);
        if (tarea == null) {
            return ResponseEntity.status(404).body(Map.of("error", "no existe"));
        }
        return ResponseEntity.ok(tarea);
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
