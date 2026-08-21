package labs;

import java.util.Map;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    @Entity
    @Table(name = "tareas")
    public static class Tarea {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        public Long id;

        public String titulo;
    }

    /**
     * Un repositorio de Spring Data: se declara la INTERFAZ y la implementacion
     * la genera el framework al arrancar.
     *
     * Es la forma mas declarativa de las cuatro, y tiene su coste: el codigo que
     * se ejecuta no esta escrito en ningun sitio que puedas leer.
     */
    public interface Tareas extends JpaRepository<Tarea, Long> {
    }

    private final Tareas tareas;
    private final JdbcTemplate jdbc;

    public Aplicacion(Tareas tareas, JdbcTemplate jdbc) {
        this.tareas = tareas;
        this.jdbc = jdbc;
    }

    @GetMapping("/salud")
    public ResponseEntity<Map<String, Boolean>> salud() {
        try {
            jdbc.queryForObject("SELECT 1", Integer.class);
            return ResponseEntity.ok(Map.of("conectado", true));
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of("conectado", false));
        }
    }

    @PostMapping("/tareas")
    public ResponseEntity<Map<String, Object>> crear(
            @RequestBody(required = false) Map<String, Object> cuerpo) {
        Tarea tarea = new Tarea();
        Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
        tarea.titulo = titulo == null ? "" : titulo.toString();
        Tarea guardada = tareas.save(tarea);
        return ResponseEntity.status(201)
                .body(Map.of("id", guardada.id.intValue(), "titulo", guardada.titulo));
    }

    @GetMapping("/tareas/{id}")
    public ResponseEntity<Map<String, Object>> obtener(@PathVariable("id") Long id) {
        return tareas.findById(id)
                .<ResponseEntity<Map<String, Object>>>map(t -> ResponseEntity.ok(
                        Map.of("id", t.id.intValue(), "titulo", t.titulo)))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE")));
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
