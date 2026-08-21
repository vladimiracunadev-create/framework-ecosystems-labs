package labs;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableJpaRepositories(considerNestedRepositories = true)
public class Aplicacion {

    /**
     * El identificador NO se genera: lo pone la semilla.
     *
     * Sin `@GeneratedValue`, el catalogo puede fijar el 1, el 2 y el 3 — y
     * «reproducible» pasa a incluir la parte que mas cuesta reproducir.
     */
    @Entity
    @Table(name = "tareas")
    public static class Tarea {
        @Id
        public Long id;

        @Column(nullable = false)
        public String titulo = "";
    }

    public interface Tareas extends JpaRepository<Tarea, Long> {
    }

    public record Fila(Long id, String titulo) {
    }

    @Service
    public static class Semillero {

        private final Tareas tareas;
        private final List<Fila> catalogo;

        /**
         * LA SEMILLA ES UN DATO, NO CODIGO.
         *
         * Estar en un recurso aparte tiene dos consecuencias practicas: se
         * revisa en una pull request como cualquier otro dato, y se puede cargar
         * desde una prueba sin arrancar la aplicacion.
         */
        public Semillero(Tareas tareas) throws Exception {
            this.tareas = tareas;
            ObjectMapper json = new ObjectMapper();
            try (InputStream entrada = getClass().getResourceAsStream("/catalogo.json")) {
                this.catalogo = List.of(json.readValue(entrada, Fila[].class));
            }
        }

        /**
         * IDEMPOTENTE POR IDENTIFICADOR, NO POR «SI ESTA VACIA».
         *
         * `save` con un identificador que ya existe hace una fusion en lugar de
         * un alta. Como los del catalogo son fijos, sembrar dos veces deja el
         * mismo estado — y no se lleva por delante lo que hayan anadido otros.
         *
         * La alternativa que se ve mucho —«si la tabla esta vacia, siembra»—
         * falla en cuanto el catalogo crece: la fila nueva no entra nunca.
         */
        @Transactional
        public int sembrar() {
            int creadas = 0;
            for (Fila fila : catalogo) {
                if (!tareas.existsById(fila.id())) {
                    creadas++;
                }
                Tarea tarea = new Tarea();
                tarea.id = fila.id();
                tarea.titulo = fila.titulo();
                tareas.save(tarea);
            }
            return creadas;
        }

        /** REINICIAR ES OTRA OPERACION: borra y vuelve a sembrar. */
        @Transactional
        public int reiniciar() {
            tareas.deleteAllInBatch();
            return sembrar();
        }

        public long total() {
            return tareas.count();
        }

        public List<Tarea> todas() {
            return tareas.findAll().stream().sorted((a, b) -> Long.compare(a.id, b.id)).toList();
        }

        @Transactional
        public Tarea anadir(String titulo) {
            // El identificador de una tarea anadida a mano se calcula a partir
            // del maximo: sin generacion automatica, nadie los reparte.
            long siguiente = tareas.findAll().stream().mapToLong(t -> t.id).max().orElse(0L) + 1;
            Tarea tarea = new Tarea();
            tarea.id = siguiente;
            tarea.titulo = titulo;
            return tareas.save(tarea);
        }
    }

    @RestController
    public static class Controlador {

        private final Semillero semillero;

        public Controlador(Semillero semillero) {
            this.semillero = semillero;
        }

        @PostMapping("/sembrar")
        public Map<String, Object> sembrar() {
            int creadas = semillero.sembrar();
            return Map.of("creadas", creadas, "total", (int) semillero.total());
        }

        @PostMapping("/reiniciar")
        public Map<String, Object> reiniciar() {
            int creadas = semillero.reiniciar();
            return Map.of("creadas", creadas, "total", (int) semillero.total());
        }

        @GetMapping("/tareas")
        public Map<String, Object> listar() {
            List<Map<String, Object>> lista = semillero.todas().stream()
                    .map(t -> Map.<String, Object>of("id", t.id.intValue(), "titulo", t.titulo))
                    .toList();
            return Map.of("tareas", lista, "total", lista.size());
        }

        @PostMapping("/tareas")
        public ResponseEntity<Map<String, Object>> crear(
                @RequestBody(required = false) Map<String, Object> cuerpo) {
            Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
            Tarea tarea = semillero.anadir(titulo == null ? "" : titulo.toString());
            return ResponseEntity.status(201)
                    .body(Map.of("id", tarea.id.intValue(), "titulo", tarea.titulo));
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
