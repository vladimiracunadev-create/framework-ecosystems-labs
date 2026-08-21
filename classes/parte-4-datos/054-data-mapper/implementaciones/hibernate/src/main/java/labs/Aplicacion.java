package labs;

import java.util.List;
import java.util.Map;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableJpaRepositories(considerNestedRepositories = true)
public class Aplicacion {

    /** La regla es del dominio, no de la base ni del framework web. */
    public static class TituloRequerido extends RuntimeException {
    }

    /**
     * LA ENTIDAD. No tiene `guardar()`, ni `buscar()`, ni `borrar()`.
     *
     * Ese es el patron Data Mapper en JPA: la entidad describe QUE es una tarea
     * y que sabe hacer una tarea; quien la guarda es el repositorio.
     *
     * Y hay una honestidad que conviene decir: las anotaciones de persistencia
     * SIGUEN AQUI. La separacion de JPA es de comportamiento, no de metadatos.
     * Para quitarlas del todo existe `orm.xml`, que casi nadie usa.
     */
    @Entity
    @Table(name = "tareas")
    public static class Tarea {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        public Long id;

        @Column(nullable = false)
        public String titulo = "";

        @Column(nullable = false)
        public boolean hecha;

        /**
         * EL CONSTRUCTOR SIN ARGUMENTOS NO ES OPCIONAL.
         *
         * Al leer una fila, Hibernate construye el objeto vacio y DESPUES le
         * pone los campos. Sin este constructor no puede hacerlo, y por eso las
         * reglas no pueden vivir en el constructor: van en una fabrica.
         */
        public Tarea() {
        }

        public static Tarea crear(String titulo) {
            Tarea tarea = new Tarea();
            tarea.renombrar(titulo);
            return tarea;
        }

        public void renombrar(String titulo) {
            if (titulo == null || titulo.isBlank()) {
                throw new TituloRequerido();
            }
            this.titulo = titulo;
        }

        public void marcar(boolean hecha) {
            this.hecha = hecha;
        }

        public Map<String, Object> salida() {
            return Map.of("id", id.intValue(), "titulo", titulo, "hecha", hecha);
        }
    }

    /** EL MAPEADOR. Spring Data genera la implementacion al arrancar. */
    public interface Tareas extends JpaRepository<Tarea, Long> {
    }

    @RestController
    public static class Controlador {

        private final Tareas tareas;

        public Controlador(Tareas tareas) {
            this.tareas = tareas;
        }

        @PostMapping("/tareas")
        public ResponseEntity<Map<String, Object>> crear(
                @RequestBody(required = false) Map<String, Object> cuerpo) {
            Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
            Tarea tarea;
            try {
                // La regla se comprueba en la FABRICA del dominio, antes de que
                // el repositorio entre en escena.
                tarea = Tarea.crear(titulo == null ? null : titulo.toString());
            } catch (TituloRequerido fallo) {
                return ResponseEntity.status(422).body(Map.of("code", "TITULO_REQUERIDO"));
            }
            return ResponseEntity.status(201).body(tareas.save(tarea).salida());
        }

        @GetMapping("/tareas")
        public Map<String, Object> listar() {
            List<Map<String, Object>> lista = tareas.findAll().stream()
                    .sorted((a, b) -> Long.compare(a.id, b.id))
                    .map(Tarea::salida).toList();
            return Map.of("tareas", lista, "total", lista.size());
        }

        @GetMapping("/tareas/{id}")
        public ResponseEntity<Map<String, Object>> obtener(@PathVariable("id") Long id) {
            return tareas.findById(id)
                    .<ResponseEntity<Map<String, Object>>>map(t -> ResponseEntity.ok(t.salida()))
                    .orElseGet(() -> ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE")));
        }

        @PatchMapping("/tareas/{id}")
        public ResponseEntity<Map<String, Object>> modificar(@PathVariable("id") Long id,
                @RequestBody(required = false) Map<String, Object> cuerpo) {
            Tarea tarea = tareas.findById(id).orElse(null);
            if (tarea == null) {
                return ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"));
            }
            Map<String, Object> datos = cuerpo == null ? Map.of() : cuerpo;
            try {
                if (datos.containsKey("titulo")) {
                    Object titulo = datos.get("titulo");
                    tarea.renombrar(titulo == null ? null : titulo.toString());
                }
                if (datos.containsKey("hecha")) {
                    tarea.marcar(Boolean.TRUE.equals(datos.get("hecha")));
                }
            } catch (TituloRequerido fallo) {
                return ResponseEntity.status(422).body(Map.of("code", "TITULO_REQUERIDO"));
            }
            return ResponseEntity.ok(tareas.save(tarea).salida());
        }

        @DeleteMapping("/tareas/{id}")
        public ResponseEntity<Object> borrar(@PathVariable("id") Long id) {
            if (!tareas.existsById(id)) {
                return ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"));
            }
            tareas.deleteById(id);
            return ResponseEntity.noContent().build();
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
