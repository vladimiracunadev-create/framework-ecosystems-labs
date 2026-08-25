package labs;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * El mismo contrato, en Spring Boot.
 *
 * Aqui el tipo AYUDA a cumplirlo: ResponseEntity.created(uri) no permite emitir
 * un 201 sin Location, y noContent().build() no admite cuerpo. Son las dos
 * lineas donde el framework empuja hacia lo correcto en vez de dejarlo a la
 * disciplina de quien escribe.
 */
@SpringBootApplication
@RestController
public class Aplicacion {

    private final Map<String, Map<String, String>> tareas = new ConcurrentHashMap<>();
    private final AtomicInteger siguiente = new AtomicInteger();

    @GetMapping("/tareas")
    public Map<String, Object> listar() {
        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("total", tareas.size());
        respuesta.put("tareas", tareas.values().stream().toList());
        return respuesta;
    }

    @PostMapping("/tareas")
    public ResponseEntity<Map<String, String>> crear(
            @RequestBody(required = false) Map<String, String> cuerpo) {
        String id = String.valueOf(siguiente.incrementAndGet());
        Map<String, String> tarea = new LinkedHashMap<>();
        tarea.put("id", id);
        tarea.put("titulo", cuerpo == null ? "" : cuerpo.getOrDefault("titulo", ""));
        tareas.put(id, tarea);
        // FUERA DE LA OMISION (1): Spring responderia 200. `created` exige la
        // URI como argumento, asi que aqui es imposible emitir el 201 y
        // olvidarse del Location.
        return ResponseEntity.created(URI.create("/tareas/" + id)).body(tarea);
    }

    @GetMapping("/tareas/{id}")
    public ResponseEntity<Map<String, String>> obtener(@PathVariable String id) {
        Map<String, String> tarea = tareas.get(id);
        // FUERA DE LA OMISION (2): el 404 por omision de Spring Boot es un JSON
        // con su propia forma —timestamp, path, error—. El contrato pide otra.
        if (tarea == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "no-encontrada"));
        }
        return ResponseEntity.ok(tarea);
    }

    @DeleteMapping("/tareas/{id}")
    public ResponseEntity<?> borrar(@PathVariable String id) {
        if (tareas.remove(id) == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "no-encontrada"));
        }
        // FUERA DE LA OMISION (3): `noContent()` no acepta cuerpo — `build()` es
        // lo unico que se puede llamar despues. El tipo impide el error.
        return ResponseEntity.noContent().build();
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
