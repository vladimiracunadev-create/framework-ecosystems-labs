package labs;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
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

    private final Map<String, Map<String, Object>> tareas = new ConcurrentHashMap<>();
    private final AtomicInteger siguiente = new AtomicInteger(2);

    public Aplicacion() {
        Map<String, Object> inicial = new LinkedHashMap<>();
        inicial.put("id", "1");
        inicial.put("titulo", "existente");
        inicial.put("completada", false);
        tareas.put("1", inicial);
    }

    @GetMapping("/tareas/{id}")
    public ResponseEntity<Map<String, Object>> obtener(@PathVariable("id") String id) {
        Map<String, Object> tarea = tareas.get(id);
        if (tarea == null) {
            return ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"));
        }
        return ResponseEntity.ok(tarea);
    }

    @PostMapping("/tareas")
    public ResponseEntity<Map<String, Object>> crear(
            @RequestBody(required = false) Map<String, Object> cuerpo) {
        Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
        String texto = titulo == null ? "" : titulo.toString().trim();
        if (texto.isEmpty()) {
            return ResponseEntity.status(422).body(Map.of("code", "VALIDACION"));
        }

        String id = String.valueOf(siguiente.getAndIncrement());
        Map<String, Object> tarea = new LinkedHashMap<>();
        tarea.put("id", id);
        tarea.put("titulo", texto);
        tarea.put("completada", false);
        tareas.put(id, tarea);

        return ResponseEntity.created(URI.create("/tareas/" + id)).body(tarea);
    }

    @DeleteMapping("/tareas/{id}")
    public ResponseEntity<Object> borrar(@PathVariable("id") String id) {
        if (tareas.remove(id) == null) {
            return ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"));
        }
        return ResponseEntity.noContent().build();
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
