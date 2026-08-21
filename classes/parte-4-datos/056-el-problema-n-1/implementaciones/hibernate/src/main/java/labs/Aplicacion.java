package labs;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
// Los repositorios de abajo son interfaces ANIDADAS, y la busqueda de Spring Data
// las ignora por omision: `considerNestedRepositories` es false. El sintoma es un
// fallo al arrancar — "No qualifying bean of type 'Aplicacion$Tareas'" — que no
// aparece hasta que el contexto se levanta.
@EnableJpaRepositories(considerNestedRepositories = true)
public class Aplicacion {

    @Entity
    @Table(name = "tareas")
    public static class Tarea {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        public Long id;

        public String titulo;

        /**
         * `LAZY` es el valor por omision de `@OneToMany`: la lista se carga al
         * TOCARLA. Es lo que hace que el problema N+1 aparezca sin escribir un
         * solo bucle de consultas.
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
        @EntityGraph(attributePaths = "etiquetas")
        List<Tarea> findAllWithEtiquetasBy();
    }

    /** Tres tareas con dos etiquetas cada una. */
    @Bean
    public CommandLineRunner semilla(Tareas tareas) {
        return args -> {
            for (String titulo : new String[] { "una", "dos", "tres" }) {
                Tarea tarea = new Tarea();
                tarea.titulo = titulo;
                for (String sufijo : new String[] { "a", "b" }) {
                    Etiqueta etiqueta = new Etiqueta();
                    etiqueta.nombre = titulo + "-" + sufijo;
                    etiqueta.tarea = tarea;
                    tarea.etiquetas.add(etiqueta);
                }
                tareas.save(tarea);
            }
        };
    }

    @RestController
    public static class Controlador {

        private final Tareas tareas;
        private final Statistics estadisticas;

        public Controlador(Tareas tareas, EntityManagerFactory fabrica) {
            this.tareas = tareas;
            // Hibernate lleva su propio contador de sentencias preparadas. Se
            // activa con `hibernate.generate_statistics` y es la forma nativa de
            // medir esto — mucho mejor que contar lineas del registro.
            this.estadisticas = fabrica.unwrap(SessionFactory.class).getStatistics();
        }

        @GetMapping("/reiniciar")
        public Map<String, Object> reiniciar() {
            estadisticas.clear();
            return Map.of("ok", true);
        }

        @GetMapping("/consultas")
        public Map<String, Object> consultas() {
            return Map.of("consultas", (int) estadisticas.getPrepareStatementCount());
        }

        private static Map<String, Object> salida(Tarea tarea) {
            List<String> nombres = tarea.etiquetas.stream().map(e -> e.nombre).sorted().toList();
            return Map.of("id", tarea.id.intValue(), "titulo", tarea.titulo, "etiquetas", nombres);
        }

        /**
         * LA FORMA INGENUA.
         *
         * Una consulta para las tareas. Y despues, al tocar `tarea.etiquetas`,
         * una consulta MAS POR TAREA — sin que nada en este codigo lo insinue.
         * Ese es el problema: el bucle parece que solo lee memoria.
         *
         * `@Transactional` hace falta para que la sesion siga abierta y la carga
         * perezosa funcione. Sin el, esto lanzaria una excepcion en lugar de ser
         * lento — que es, curiosamente, el fallo menos malo de los dos.
         */
        @GetMapping("/tareas-n1")
        @Transactional(readOnly = true)
        public Map<String, Object> nMasUno() {
            return Map.of("tareas", tareas.findAll().stream().map(Controlador::salida).toList());
        }

        /** LA FORMA ANTICIPADA: el grafo declara que traiga las etiquetas. */
        @GetMapping("/tareas-anticipada")
        @Transactional(readOnly = true)
        public Map<String, Object> anticipada() {
            return Map.of("tareas",
                    tareas.findAllWithEtiquetasBy().stream().map(Controlador::salida).toList());
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
