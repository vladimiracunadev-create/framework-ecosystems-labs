package labs;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

import javax.sql.DataSource;

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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * TRES FORMAS DE PROBAR LO MISMO.
 *
 * - `doble`: un objeto en memoria que imita al repositorio. No hay motor.
 * - `en-memoria`: una base de VERDAD, creada para las pruebas y desechable.
 * - `real`: la misma base que usa el servicio.
 *
 * Las cuatro pruebas son identicas en las tres. Lo que cambia es que detectan —
 * y una de ellas solo pasa cuando hay un motor detras.
 */
@SpringBootApplication
@EnableJpaRepositories(considerNestedRepositories = true)
public class Aplicacion {

    public record Fila(long id, String titulo) {
    }

    @Entity
    @Table(name = "tareas")
    public static class Tarea {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        public Long id;

        // LA RESTRICCION QUE DECIDE LA CLASE. La aplica la BASE, no el codigo —
        // y por eso un doble en memoria no la ve.
        @Column(nullable = false, unique = true)
        public String titulo = "";
    }

    public interface Tareas extends JpaRepository<Tarea, Long> {
    }

    /** Lo unico que las pruebas necesitan. Cuatro metodos. */
    public interface Repositorio {
        void limpiar();

        Fila crear(String titulo);

        Fila porId(long id);

        void borrar(long id);
    }

    /** El repositorio de verdad: delega en el motor y deja que el aplique sus reglas. */
    public static final class RepositorioJpa implements Repositorio {
        private final Tareas tareas;

        public RepositorioJpa(Tareas tareas) {
            this.tareas = tareas;
        }

        @Override
        public void limpiar() {
            tareas.deleteAllInBatch();
        }

        @Override
        public Fila crear(String titulo) {
            Tarea tarea = new Tarea();
            tarea.titulo = titulo;
            Tarea guardada = tareas.saveAndFlush(tarea);
            return new Fila(guardada.id, guardada.titulo);
        }

        @Override
        public Fila porId(long id) {
            return tareas.findById(id).map(t -> new Fila(t.id, t.titulo)).orElse(null);
        }

        @Override
        public void borrar(long id) {
            tareas.deleteById(id);
        }
    }

    /** El mismo trabajo contra OTRA base, creada solo para las pruebas. */
    public static final class RepositorioJdbc implements Repositorio {
        private final JdbcTemplate jdbc;

        public RepositorioJdbc(JdbcTemplate jdbc) {
            this.jdbc = jdbc;
        }

        @Override
        public void limpiar() {
            jdbc.execute("DELETE FROM tareas");
        }

        @Override
        public Fila crear(String titulo) {
            jdbc.update("INSERT INTO tareas (titulo) VALUES (?)", titulo);
            Long id = jdbc.queryForObject(
                    "SELECT id FROM tareas WHERE titulo = ?", Long.class, titulo);
            return new Fila(id, titulo);
        }

        @Override
        public Fila porId(long id) {
            List<Fila> filas = jdbc.query(
                    "SELECT id, titulo FROM tareas WHERE id = ?",
                    (rs, i) -> new Fila(rs.getLong("id"), rs.getString("titulo")),
                    id);
            return filas.isEmpty() ? null : filas.get(0);
        }

        @Override
        public void borrar(long id) {
            jdbc.update("DELETE FROM tareas WHERE id = ?", id);
        }
    }

    /**
     * EL DOBLE.
     *
     * Hace lo mismo con un mapa, y no comprueba la unicidad — igual que los
     * repositorios de verdad, que tampoco la comprueban: la aplica la base.
     *
     * Ese detalle es la clase entera. El doble no es incorrecto: es INCOMPLETO,
     * y su hueco tiene exactamente la forma de lo que el motor hacia por ti.
     */
    public static final class Doble implements Repositorio {
        private final Map<Long, Fila> filas = new HashMap<>();
        private long siguiente = 1;

        @Override
        public void limpiar() {
            filas.clear();
            siguiente = 1;
        }

        @Override
        public Fila crear(String titulo) {
            Fila fila = new Fila(siguiente++, titulo);
            filas.put(fila.id(), fila);
            return fila;
        }

        @Override
        public Fila porId(long id) {
            return filas.get(id);
        }

        @Override
        public void borrar(long id) {
            filas.remove(id);
        }
    }

    private record Prueba(String nombre, Predicate<Repositorio> ejecutar) {
    }

    /** LAS CUATRO PRUEBAS. Las mismas para las tres estrategias. */
    private static final List<Prueba> PRUEBAS = List.of(
            new Prueba("se crea y devuelve un identificador",
                    r -> r.crear("comprar pan").id() > 0),
            new Prueba("se lee de vuelta lo que se escribio", r -> {
                Fila creada = r.crear("regar");
                Fila leida = r.porId(creada.id());
                return leida != null && "regar".equals(leida.titulo());
            }),
            new Prueba("lo borrado deja de estar", r -> {
                Fila creada = r.crear("llamar");
                r.borrar(creada.id());
                return r.porId(creada.id()) == null;
            }),
            new Prueba("la restriccion de unicidad la aplica la base, no el codigo", r -> {
                r.crear("repetida");
                try {
                    r.crear("repetida");
                    return false; // no protesto: el hueco del doble
                } catch (RuntimeException fallo) {
                    return true;
                }
            }));

    private static final List<String> ESTRATEGIAS = List.of("doble", "en-memoria", "real");

    @RestController
    public static class Controlador {

        private final Tareas tareas;
        private final JdbcTemplate pruebas;

        public Controlador(Tareas tareas, DataSource fuenteReal) {
            this.tareas = tareas;
            // Una SEGUNDA base H2, distinta de la del servicio. Es el equivalente
            // exacto de lo que se hace en un proyecto real: un motor de pruebas
            // desechable, separado del de produccion.
            DriverManagerDataSource fuente = new DriverManagerDataSource(
                    "jdbc:h2:mem:pruebas065;DB_CLOSE_DELAY=-1");
            fuente.setDriverClassName("org.h2.Driver");
            this.pruebas = new JdbcTemplate(fuente);
            this.pruebas.execute("DROP TABLE IF EXISTS tareas");
            this.pruebas.execute(
                    "CREATE TABLE tareas (id INT AUTO_INCREMENT PRIMARY KEY, "
                            + "titulo VARCHAR(120) NOT NULL UNIQUE)");
        }

        private Repositorio repositorioDe(String estrategia) {
            return switch (estrategia) {
                case "doble" -> new Doble();
                case "en-memoria" -> new RepositorioJdbc(pruebas);
                default -> new RepositorioJpa(tareas);
            };
        }

        private List<Map<String, Object>> ejecutar(String estrategia) {
            Repositorio repositorio = repositorioDe(estrategia);
            List<Map<String, Object>> resultados = new ArrayList<>();
            for (Prueba prueba : PRUEBAS) {
                repositorio.limpiar();
                boolean paso;
                try {
                    paso = prueba.ejecutar().test(repositorio);
                } catch (RuntimeException fallo) {
                    paso = false;
                }
                resultados.add(Map.of("nombre", prueba.nombre(), "paso", paso));
            }
            repositorio.limpiar();
            return resultados;
        }

        @GetMapping("/estrategias")
        public Map<String, Object> estrategias() {
            return Map.of("estrategias", ESTRATEGIAS, "pruebas_por_estrategia", PRUEBAS.size());
        }

        @GetMapping("/probar")
        public ResponseEntity<Map<String, Object>> probar(
                @RequestParam(name = "estrategia", defaultValue = "") String estrategia) {
            if (!ESTRATEGIAS.contains(estrategia)) {
                return ResponseEntity.status(400).body(Map.of("code", "ESTRATEGIA_DESCONOCIDA"));
            }
            List<Map<String, Object>> resultados = ejecutar(estrategia);
            long pasadas = resultados.stream()
                    .filter(r -> Boolean.TRUE.equals(r.get("paso"))).count();
            return ResponseEntity.ok(Map.of(
                    "estrategia", estrategia,
                    "ejecutadas", resultados.size(),
                    "pasadas", (int) pasadas,
                    "usa_motor", !"doble".equals(estrategia),
                    "detalle", resultados));
        }

        /** DONDE ESTA EL HUECO, exactamente. */
        @GetMapping("/que-se-escapa")
        public Map<String, Object> queSeEscapa() {
            int indice = PRUEBAS.size() - 1;
            return Map.of(
                    "prueba", "la restricción de unicidad la aplica la base, no el código",
                    "doble", ejecutar("doble").get(indice).get("paso"),
                    "en_memoria", ejecutar("en-memoria").get(indice).get("paso"),
                    "real", ejecutar("real").get(indice).get("paso"));
        }

        /** Y POR QUE SE USA IGUALMENTE EL DOBLE: porque es mucho mas rapido. */
        @GetMapping("/comparacion")
        public Map<String, Object> comparacion() {
            Map<String, Object> tiempos = new HashMap<>();
            long minimo = Long.MAX_VALUE;
            long delDoble = 0;
            for (String estrategia : ESTRATEGIAS) {
                long inicio = System.nanoTime();
                for (int i = 0; i < 20; i++) {
                    ejecutar(estrategia);
                }
                long ms = (System.nanoTime() - inicio) / 1_000_000;
                tiempos.put(estrategia, (int) ms);
                minimo = Math.min(minimo, ms);
                if ("doble".equals(estrategia)) {
                    delDoble = ms;
                }
            }
            return Map.of(
                    "tiempos_ms", tiempos,
                    "repeticiones", 20,
                    "doble_es_el_mas_rapido", delDoble == minimo);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
