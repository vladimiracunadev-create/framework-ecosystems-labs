package labs;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class Aplicacion {

    // El registro de auditoria como COMPONENTE inyectable: un solo lugar por
    // donde pasa cada cambio, compartido por quien lo necesite. En produccion
    // es un almacen de solo apendice, aparte de la base de negocio.
    @Component
    public static class Auditoria {
        private final List<Map<String, String>> registros = new CopyOnWriteArrayList<>();

        public void registrar(String actor, String accion, String recurso, String id) {
            Map<String, String> entrada = new LinkedHashMap<>();
            entrada.put("actor", actor == null || actor.isEmpty() ? "anonimo" : actor);
            entrada.put("accion", accion);
            entrada.put("recurso", recurso);
            entrada.put("recurso_id", id);
            // El instante lo pone el SERVIDOR, no el cliente.
            entrada.put("instante", Instant.now().toString());
            registros.add(entrada);
        }

        public List<Map<String, String>> todos() {
            return registros;
        }
    }

    @RestController
    public static class Controlador {
        private final Map<String, Map<String, String>> tareas = new ConcurrentHashMap<>();
        private final AtomicInteger siguiente = new AtomicInteger(1);
        private final Auditoria auditoria;

        public Controlador(Auditoria auditoria) {
            this.auditoria = auditoria;
        }

        @PostMapping("/tareas")
        public ResponseEntity<Map<String, String>> crear(
                @RequestBody(required = false) Map<String, String> cuerpo,
                @RequestHeader(name = "X-Actor", required = false) String actor) {
            String id = String.valueOf(siguiente.getAndIncrement());
            Map<String, String> tarea = new LinkedHashMap<>();
            tarea.put("id", id);
            tarea.put("titulo", cuerpo == null ? "" : cuerpo.getOrDefault("titulo", ""));
            tareas.put(id, tarea);
            auditoria.registrar(actor, "crear", "tarea", id);
            return ResponseEntity.status(HttpStatus.CREATED).body(tarea);
        }

        @GetMapping("/tareas/{id}")
        public ResponseEntity<Map<String, String>> obtener(@PathVariable String id) {
            // Leer NO se audita: la auditoria registra cambios.
            Map<String, String> tarea = tareas.get(id);
            if (tarea == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "no-encontrada"));
            }
            return ResponseEntity.ok(tarea);
        }

        @DeleteMapping("/tareas/{id}")
        public ResponseEntity<Void> borrar(
                @PathVariable String id,
                @RequestHeader(name = "X-Actor", required = false) String actor) {
            if (!tareas.containsKey(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            tareas.remove(id);
            auditoria.registrar(actor, "borrar", "tarea", id);
            return ResponseEntity.noContent().build();
        }

        @GetMapping("/auditoria")
        public Map<String, Object> listar() {
            List<Map<String, String>> todos = new ArrayList<>(auditoria.todos());
            return Map.of("total", todos.size(), "registros", todos);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
