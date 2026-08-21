package labs;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableJpaRepositories(considerNestedRepositories = true)
public class Aplicacion {

    /**
     * La entidad describe el estado FINAL del esquema. Las migraciones de
     * `db/migration/` describen el camino hasta el, y son las que se ejecutan.
     *
     * Que los dos coincidan NO lo comprueba nadie automaticamente: es la
     * responsabilidad que se acepta al apagar `ddl-auto`.
     */
    @Entity
    @Table(name = "tareas")
    public static class Tarea {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        public Long id;

        @Column(nullable = false)
        public String titulo;

        @Column(nullable = false)
        public int prioridad;
    }

    public interface Tareas extends JpaRepository<Tarea, Long> {
    }

    @RestController
    public static class Controlador {

        private final Tareas tareas;
        private final JdbcTemplate jdbc;
        private final Flyway flyway;

        // Spring Boot registra el propio Flyway que ya ejecuto al arrancar. Se
        // inyecta EL MISMO: volver a pedirle que migre es lo que prueba que no
        // repite trabajo.
        public Controlador(Tareas tareas, JdbcTemplate jdbc, Flyway flyway) {
            this.tareas = tareas;
            this.jdbc = jdbc;
            this.flyway = flyway;
        }

        /**
         * El historial vive en una tabla de la propia base —`flyway_schema_history`—
         * pero se lee por la API en lugar de por SQL.
         *
         * No es pereza: Flyway crea esa tabla con los identificadores ENTRECOMILLADOS
         * en minusculas, y H2 pasa a mayusculas los que no lo estan. Un
         * `SELECT script FROM flyway_schema_history` falla por eso, y el fallo no
         * dice nada util. La API no depende del motor.
         */
        private List<String> aplicadas() {
            return Arrays.stream(flyway.info().applied())
                    .map(MigrationInfo::getScript)
                    .filter(guion -> guion != null && guion.endsWith(".sql"))
                    .toList();
        }

        @GetMapping("/historial")
        public Map<String, Object> historial() {
            List<String> lista = aplicadas();
            return Map.of("aplicadas", lista, "total", lista.size());
        }

        /**
         * Se lee del CATALOGO de la base, no de la entidad. Leerlo de la entidad
         * probaria que la clase dice lo que dice, no que la migracion se aplico.
         *
         * H2 guarda los identificadores en mayusculas y SQLite tal cual se
         * escribieron; pasarlos a minusculas iguala esa diferencia de motor, que
         * no es de lo que trata la clase.
         */
        @GetMapping("/esquema")
        public Map<String, Object> esquema() {
            List<String> columnas = jdbc.queryForList(
                    "SELECT LOWER(column_name) FROM information_schema.columns "
                            + "WHERE LOWER(table_name) = 'tareas' ORDER BY 1",
                    String.class);
            return Map.of("columnas", columnas);
        }

        @GetMapping("/tareas")
        public Map<String, Object> listar() {
            return Map.of("tareas", tareas.findAll().stream()
                    .sorted((a, b) -> Long.compare(a.id, b.id))
                    .map(Controlador::salida).toList());
        }

        @PostMapping("/tareas")
        public ResponseEntity<Map<String, Object>> crear(
                @RequestBody(required = false) Map<String, Object> cuerpo) {
            Tarea tarea = new Tarea();
            Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
            Object prioridad = cuerpo == null ? null : cuerpo.get("prioridad");
            tarea.titulo = titulo == null ? "" : titulo.toString();
            tarea.prioridad = prioridad instanceof Number n ? n.intValue() : 0;
            return ResponseEntity.status(201).body(salida(tareas.save(tarea)));
        }

        /** Volver a migrar no aplica nada: la historia ya las tiene. */
        @PostMapping("/migrar")
        public Map<String, Object> migrar() {
            int nuevas = flyway.migrate().migrationsExecuted;
            return Map.of("nuevas", nuevas, "total", aplicadas().size());
        }

        private static Map<String, Object> salida(Tarea tarea) {
            return Map.of("id", tarea.id.intValue(), "titulo", tarea.titulo,
                    "prioridad", tarea.prioridad);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
