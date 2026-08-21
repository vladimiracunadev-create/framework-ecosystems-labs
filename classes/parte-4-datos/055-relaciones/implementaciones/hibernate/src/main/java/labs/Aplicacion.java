package labs;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * El controlador va en una clase APARTE de la de arranque: la clase
 * `@SpringBootApplication` se construye muy pronto, y darle un constructor con
 * repositorios de JPA crea un problema de orden al iniciar.
 */
@SpringBootApplication
public class Aplicacion {

    @Entity
    @Table(name = "tareas")
    public static class Tarea {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        public Long id;

        public String titulo;

        /**
         * `cascade = ALL` propaga guardar y borrar a los hijos; `orphanRemoval`
         * borra el hijo que se saca de la lista.
         *
         * Y `fetch = LAZY` es el valor por omision de `@OneToMany`: la lista NO
         * se carga hasta que se toca. Comodo, y el origen exacto del problema de
         * la clase 056.
         */
        @OneToMany(mappedBy = "tarea", cascade = CascadeType.ALL,
                orphanRemoval = true, fetch = FetchType.LAZY)
        public List<Etiqueta> etiquetas = new ArrayList<>();
    }

    @Entity
    @Table(name = "etiquetas")
    public static class Etiqueta {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        public Long id;

        public String nombre;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "tarea_id")
        public Tarea tarea;
    }

    public interface Tareas extends JpaRepository<Tarea, Long> {
        /**
         * `@EntityGraph` declara QUE cargar de una vez. Es la carga anticipada
         * de JPA, y sin ella `tarea.etiquetas` dispara otra consulta al tocarse.
         */
        @EntityGraph(attributePaths = "etiquetas")
        Optional<Tarea> findWithEtiquetasById(Long id);
    }

    public interface Etiquetas extends JpaRepository<Etiqueta, Long> {
    }

    private static Map<String, Object> salida(Tarea tarea) {
        List<String> nombres = tarea.etiquetas.stream().map(e -> e.nombre).sorted().toList();
        return Map.of("id", tarea.id.intValue(), "titulo", tarea.titulo, "etiquetas", nombres);
    }

    @RestController
    public static class Controlador {

        private final Tareas tareas;
        private final Etiquetas etiquetas;

        public Controlador(Tareas tareas, Etiquetas etiquetas) {
            this.tareas = tareas;
            this.etiquetas = etiquetas;
        }

        @PostMapping("/tareas")
        public ResponseEntity<Map<String, Object>> crear(
                @RequestBody(required = false) Map<String, Object> cuerpo) {
            Tarea tarea = new Tarea();
            Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
            tarea.titulo = titulo == null ? "" : titulo.toString();

            Object recibidas = cuerpo == null ? null : cuerpo.get("etiquetas");
            if (recibidas instanceof List<?> lista) {
                for (Object nombre : lista) {
                    Etiqueta etiqueta = new Etiqueta();
                    etiqueta.nombre = nombre.toString();
                    // Los DOS lados de la relacion. Poner solo uno deja el objeto en
                    // un estado incoherente y la clave ajena sin valor.
                    etiqueta.tarea = tarea;
                    tarea.etiquetas.add(etiqueta);
                }
    }

        return ResponseEntity.status(201).body(salida(tareas.save(tarea)));
    }

    @GetMapping("/tareas/{id}")
    public ResponseEntity<Map<String, Object>> obtener(@PathVariable("id") Long id) {
        return tareas.findWithEtiquetasById(id)
                .<ResponseEntity<Map<String, Object>>>map(t -> ResponseEntity.ok(salida(t)))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE")));
    }

    @DeleteMapping("/tareas/{id}")
    public ResponseEntity<Object> borrar(@PathVariable("id") Long id) {
        if (!tareas.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"));
        }
        tareas.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/etiquetas")
    public Map<String, Object> contar() {
        return Map.of("total", (int) etiquetas.count());
    }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
