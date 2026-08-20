package labs;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    private final Map<String, Map<String, String>> tareas = new HashMap<>(
            Map.of("1", Map.of("id", "1", "titulo", "original")));
    private final AtomicInteger altas = new AtomicInteger();

    private static String tituloDe(Map<String, Object> cuerpo) {
        Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
        return titulo == null ? "" : titulo.toString();
    }

    @GetMapping("/tareas/{id}")
    public ResponseEntity<Map<String, String>> obtener(@PathVariable("id") String id) {
        Map<String, String> tarea = tareas.get(id);
        return tarea == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(tarea);
    }

    @PutMapping("/tareas/{id}")
    public Map<String, String> sustituir(@PathVariable("id") String id,
            @RequestBody(required = false) Map<String, Object> cuerpo) {
        Map<String, String> tarea = Map.of("id", id, "titulo", tituloDe(cuerpo));
        tareas.put(id, tarea);
        return tarea;
    }

    @PostMapping("/tareas")
    public ResponseEntity<Map<String, Object>> crear(
            @RequestBody(required = false) Map<String, Object> cuerpo) {
        int n = altas.incrementAndGet();
        String id = "nueva-" + n;
        tareas.put(id, Map.of("id", id, "titulo", tituloDe(cuerpo)));
        return ResponseEntity.created(URI.create("/tareas/" + id))
                .body(Map.of("id", id, "altas", n));
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
