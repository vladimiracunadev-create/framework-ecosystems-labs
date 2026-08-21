package labs;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

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
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
// Los repositorios de abajo son interfaces ANIDADAS, y la busqueda de Spring Data
// las ignora por omision: `considerNestedRepositories` es false.
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
        /**
         * `@EntityGraph` declara QUE cargar de una vez. Hibernate lo resuelve con
         * una UNION: una sola consulta, y las filas de la tarea duplicadas — una
         * por etiqueta. Es la estrategia opuesta al `selectinload` de SQLAlchemy.
         */
        @EntityGraph(attributePaths = "etiquetas")
        List<Tarea> findAllWithEtiquetasByOrderById();

        List<Tarea> findAllByOrderById();
    }

    private static final String[] TITULOS = { "una", "dos", "tres", "cuatro", "cinco", "seis" };

    @Service
    public static class Almacen {

        private final Tareas tareas;
        private final JdbcTemplate jdbc;
        private final Statistics estadisticas;

        public Almacen(Tareas tareas, JdbcTemplate jdbc, EntityManagerFactory fabrica) {
            this.tareas = tareas;
            this.jdbc = jdbc;
            // Hibernate lleva su propio contador de sentencias preparadas. Se
            // activa con `hibernate.generate_statistics` y es la forma nativa de
            // medir esto — mucho mejor que contar lineas del registro.
            this.estadisticas = fabrica.unwrap(SessionFactory.class).getStatistics();
        }

        public long consultas() {
            return estadisticas.getPrepareStatementCount();
        }

        public void reiniciarContador() {
            estadisticas.clear();
        }

        /** Cada tarea con dos etiquetas. El numero de tareas es el parametro. */
        @Transactional
        public int sembrar(int cuantas) {
            // `deleteAll` y no `deleteAllInBatch`: el borrado en lote se salta la
            // cascada, y dejaria las etiquetas apuntando a tareas que ya no estan.
            tareas.deleteAll();
            // `flush` antes del DDL: sin el, los borrados siguen en el contexto
            // de persistencia y la sentencia de abajo se ejecutaria contra una
            // tabla que la base todavia ve llena.
            tareas.flush();
            // Borrar las filas NO reinicia el contador de la identidad: la
            // siguiente tarea seria la 4, no la 1, y el contrato dejaria de ser
            // reproducible. Es el mismo detalle que la clase 059 encuentra en
            // SQLite con `sqlite_sequence`, aqui en H2.
            jdbc.execute("ALTER TABLE tareas ALTER COLUMN id RESTART WITH 1");
            jdbc.execute("ALTER TABLE etiquetas ALTER COLUMN id RESTART WITH 1");
            for (int i = 0; i < cuantas; i++) {
                Tarea tarea = new Tarea();
                tarea.titulo = TITULOS[i];
                for (String sufijo : new String[] { "a", "b" }) {
                    Etiqueta etiqueta = new Etiqueta();
                    etiqueta.nombre = tarea.titulo + "-" + sufijo;
                    etiqueta.tarea = tarea;
                    tarea.etiquetas.add(etiqueta);
                }
                tareas.save(tarea);
            }
            return cuantas;
        }

        /**
         * LA FORMA INGENUA.
         *
         * Una consulta para las tareas. Y despues, al tocar `tarea.etiquetas`,
         * una consulta MAS POR TAREA — sin que nada en este codigo lo insinue.
         *
         * `@Transactional` hace falta para que la sesion siga abierta y la carga
         * perezosa funcione. Sin el, esto lanzaria una excepcion en lugar de ser
         * lento — que es, curiosamente, el fallo menos malo de los dos.
         */
        @Transactional(readOnly = true)
        public List<Map<String, Object>> ingenua() {
            return tareas.findAllByOrderById().stream().map(Almacen::salida).toList();
        }

        /** LA FORMA ANTICIPADA: el grafo declara que traiga las etiquetas. */
        @Transactional(readOnly = true)
        public List<Map<String, Object>> anticipada() {
            return tareas.findAllWithEtiquetasByOrderById().stream()
                    .map(Almacen::salida).toList();
        }

        private static Map<String, Object> salida(Tarea tarea) {
            List<String> nombres = tarea.etiquetas.stream().map(e -> e.nombre).sorted().toList();
            return Map.of("id", tarea.id.intValue(), "titulo", tarea.titulo, "etiquetas", nombres);
        }
    }

    @RestController
    public static class Controlador {

        private final Almacen almacen;

        public Controlador(Almacen almacen) {
            this.almacen = almacen;
        }

        @GetMapping("/reiniciar")
        public Map<String, Object> reiniciar() {
            int tareas = almacen.sembrar(3);
            almacen.reiniciarContador();
            return Map.of("consultas", (int) almacen.consultas(), "tareas", tareas);
        }

        @GetMapping("/consultas")
        public Map<String, Object> consultas() {
            return Map.of("consultas", (int) almacen.consultas());
        }

        @GetMapping("/tareas-n1")
        public Map<String, Object> nMasUno() {
            return Map.of("tareas", almacen.ingenua());
        }

        @GetMapping("/tareas-anticipada")
        public Map<String, Object> anticipada() {
            return Map.of("tareas", almacen.anticipada());
        }

        /**
         * LO UNICO QUE DISTINGUE EL PROBLEMA.
         *
         * Un numero absoluto de consultas no dice nada: la carga anticipada
         * cuesta UNA con union —lo que hace Hibernate— y DOS con segunda
         * consulta, y las dos estan bien. Lo que importa es si ese numero CRECE
         * con el numero de filas.
         */
        @GetMapping("/crecimiento")
        public ResponseEntity<Map<String, Object>> crecimiento(
                @RequestParam(name = "ruta", defaultValue = "") String ruta) {
            Supplier<List<Map<String, Object>>> funcion = switch (ruta) {
                case "tareas-n1" -> almacen::ingenua;
                case "tareas-anticipada" -> almacen::anticipada;
                default -> null;
            };
            if (funcion == null) {
                return ResponseEntity.status(404).body(Map.of("code", "RUTA_DESCONOCIDA"));
            }

            int con3 = medir(funcion, 3);
            int con6 = medir(funcion, 6);
            almacen.sembrar(3);

            return ResponseEntity.ok(Map.of(
                    "con_3", con3, "con_6", con6, "crecimiento", con6 - con3));
        }

        private int medir(Supplier<List<Map<String, Object>>> funcion, int cuantas) {
            almacen.sembrar(cuantas);
            almacen.reiniciarContador();
            funcion.get();
            return (int) almacen.consultas();
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
