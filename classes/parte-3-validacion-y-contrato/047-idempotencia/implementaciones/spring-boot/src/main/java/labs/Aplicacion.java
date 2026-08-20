package labs;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    private final Map<String, Map<String, String>> tareas = new ConcurrentHashMap<>();
    private final Map<String, Map<String, String>> respuestas = new ConcurrentHashMap<>();
    private final AtomicInteger siguiente = new AtomicInteger(1);

    private Map<String, String> crear(String titulo) {
        String id = String.valueOf(siguiente.getAndIncrement());
        Map<String, String> tarea = new LinkedHashMap<>();
        tarea.put("id", id);
        tarea.put("titulo", titulo == null ? "" : titulo);
        tareas.put(id, tarea);
        return tarea;
    }

    @PostMapping("/tareas")
    public ResponseEntity<Map<String, String>> crearTarea(
            @RequestHeader(name = "Idempotency-Key", required = false) String clave,
            @RequestBody(required = false) Map<String, Object> cuerpo) {
        Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
        String texto = titulo == null ? "" : titulo.toString();

        if (clave == null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(crear(texto));
        }

        // `computeIfAbsent` es atomico: dos peticiones simultaneas con la misma
        // clave no pueden crear dos tareas. Un `if (contiene) ... else ...` si
        // podria, y ese hueco es justo lo que la idempotencia quiere cerrar.
        Map<String, String> previa = respuestas.get(clave);
        if (previa != null) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .header("Idempotent-Replay", "true").body(previa);
        }

        Map<String, String> creada = respuestas.computeIfAbsent(clave, k -> crear(texto));
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @GetMapping("/tareas")
    public Map<String, Integer> contar() {
        return Map.of("total", tareas.size());
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
