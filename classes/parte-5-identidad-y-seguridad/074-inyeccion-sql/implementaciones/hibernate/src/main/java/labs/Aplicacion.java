package labs;

import java.util.List;
import java.util.Map;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Hibernate (via Spring Data JPA): la consulta la construye el ORM y los
// valores viajan como parametros vinculados. Un titulo que sea
// `'); DROP TABLE tareas; --` es un valor de columna, no una sentencia — no
// hay concatenacion posible a traves de la API del repositorio.
@SpringBootApplication
@EnableJpaRepositories(considerNestedRepositories = true)
@RestController
public class Aplicacion {

    @Entity
    @Table(name = "tareas")
    public static class Tarea {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        public Long id;
        public String titulo = "";
    }

    // findByTitulo genera un WHERE titulo = ? con parametro vinculado: el
    // clasico `' OR '1'='1` se busca como ese texto exacto → lista vacia.
    public interface Tareas extends JpaRepository<Tarea, Long> {
        List<Tarea> findByTitulo(String titulo);
    }

    private final Tareas tareas;

    public Aplicacion(Tareas tareas) {
        this.tareas = tareas;
    }

    @Bean
    CommandLineRunner sembrar(Tareas repo) {
        return args -> {
            for (String titulo : new String[] {"preparar informe", "revisar contrato"}) {
                Tarea t = new Tarea();
                t.titulo = titulo;
                repo.save(t);
            }
        };
    }

    private Map<String, String> aMapa(Tarea t) {
        return Map.of("id", String.valueOf(t.id), "titulo", t.titulo);
    }

    @PostMapping("/tareas")
    public ResponseEntity<Map<String, String>> crear(@RequestBody Map<String, String> cuerpo) {
        Tarea t = new Tarea();
        t.titulo = cuerpo.getOrDefault("titulo", "");
        Tarea guardada = tareas.save(t);
        return ResponseEntity.status(HttpStatus.CREATED).body(aMapa(guardada));
    }

    @GetMapping("/tareas")
    public Map<String, Object> listar(@RequestParam(required = false) String titulo) {
        List<Tarea> filas = titulo == null ? tareas.findAll() : tareas.findByTitulo(titulo);
        return Map.of("total", filas.size(), "tareas", filas.stream().map(this::aMapa).toList());
    }

    @GetMapping("/tareas/{id}")
    public ResponseEntity<Map<String, String>> obtener(@PathVariable Long id) {
        return tareas.findById(id)
                .map(t -> ResponseEntity.ok(aMapa(t)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "no-encontrada")));
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
