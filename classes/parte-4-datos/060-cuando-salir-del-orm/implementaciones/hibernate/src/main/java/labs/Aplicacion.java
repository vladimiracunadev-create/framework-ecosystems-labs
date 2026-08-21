package labs;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableJpaRepositories(considerNestedRepositories = true)
public class Aplicacion {

    @Entity
    @Table(name = "tareas")
    public static class Tarea {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        public Long id;

        @Column(nullable = false)
        public String proyecto = "";

        @Column(nullable = false)
        public String titulo = "";

        @Column(nullable = false)
        public boolean hecha;
    }

    public interface Tareas extends JpaRepository<Tarea, Long> {
    }

    private static final String[][] SEMILLA = {
        { "casa", "comprar pan", "true" },
        { "casa", "regar", "false" },
        { "trabajo", "informe", "true" },
        { "viaje", "reservar", "false" },
    };

    @Service
    public static class Almacen {

        private final Tareas tareas;
        private final JdbcTemplate jdbc;

        /**
         * Cuantas FILAS le llegan al proceso. Es la medida honesta de esta clase:
         * los dos informes devuelven lo mismo, y lo que cambia es cuanto viaja
         * por la red y cuanto trabajo hace el proceso en lugar del motor.
         */
        private int filasLeidas;

        public Almacen(Tareas tareas, JdbcTemplate jdbc) {
            this.tareas = tareas;
            this.jdbc = jdbc;
        }

        public int filasLeidas() {
            return filasLeidas;
        }

        @Transactional
        public void sembrar() {
            tareas.deleteAllInBatch();
            for (String[] fila : SEMILLA) {
                Tarea tarea = new Tarea();
                tarea.proyecto = fila[0];
                tarea.titulo = fila[1];
                tarea.hecha = Boolean.parseBoolean(fila[2]);
                tareas.save(tarea);
            }
            filasLeidas = 0;
        }

        /**
         * CON EL ORM. JPQL sabe agregar perfectamente; aqui se hace a proposito
         * lo que se hace de verdad cuando la agregacion no encaja en el
         * mapeador: traerse las entidades y agrupar en memoria.
         *
         * Con cuatro tareas da igual. Con cuatro millones, el proceso se queda
         * sin memoria haciendo un trabajo que el motor sabe hacer sin moverlas.
         */
        public List<Map<String, Object>> informeOrm() {
            List<Tarea> todas = tareas.findAll();
            filasLeidas = todas.size();

            Map<String, int[]> acumulado = new LinkedHashMap<>();
            for (Tarea tarea : todas) {
                int[] valores = acumulado.computeIfAbsent(tarea.proyecto, k -> new int[2]);
                valores[0]++;
                if (tarea.hecha) {
                    valores[1]++;
                }
            }

            List<Map<String, Object>> filas = new ArrayList<>();
            acumulado.entrySet().stream()
                    .sorted(Comparator.comparing(Map.Entry::getKey))
                    .forEach(e -> filas.add(Map.of(
                            "proyecto", e.getKey(),
                            "total", e.getValue()[0],
                            "hechas", e.getValue()[1])));
            return filas;
        }

        /**
         * EN SQL. El motor agrupa y devuelve TRES filas.
         *
         * El `?` es un marcador, no una interpolacion: `JdbcTemplate` manda la
         * sentencia y el valor por separado. Salir del ORM no significa salir de
         * las consultas parametrizadas — eso no se negocia nunca.
         */
        public List<Map<String, Object>> informeSql(int minimo) {
            List<Map<String, Object>> filas = jdbc.query("""
                    SELECT proyecto,
                           COUNT(*)                               AS total,
                           SUM(CASE WHEN hecha THEN 1 ELSE 0 END) AS hechas
                      FROM tareas
                     GROUP BY proyecto
                    HAVING COUNT(*) >= ?
                     ORDER BY proyecto
                    """,
                    (rs, i) -> Map.<String, Object>of(
                            "proyecto", rs.getString("proyecto"),
                            "total", rs.getInt("total"),
                            "hechas", rs.getInt("hechas")),
                    minimo);
            filasLeidas = filas.size();
            return filas;
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
            almacen.sembrar();
            return Map.of("tareas", SEMILLA.length, "proyectos", 3);
        }

        @GetMapping("/filas-leidas")
        public Map<String, Object> filasLeidas() {
            return Map.of("filas_leidas", almacen.filasLeidas());
        }

        @GetMapping("/informe-orm")
        public Map<String, Object> informeOrm() {
            return Map.of("filas", almacen.informeOrm());
        }

        @GetMapping("/informe-sql")
        public ResponseEntity<Map<String, Object>> informeSql(
                @RequestParam(name = "minimo", defaultValue = "1") String minimo) {
            // El parametro se valida ANTES de llegar a la consulta: un marcador
            // solo vale para un valor, asi que si esperas un numero, compruebalo.
            int limite;
            try {
                limite = Integer.parseInt(minimo);
            } catch (NumberFormatException fallo) {
                return ResponseEntity.status(400).body(Map.of("code", "MINIMO_INVALIDO"));
            }
            if (limite < 0) {
                return ResponseEntity.status(400).body(Map.of("code", "MINIMO_INVALIDO"));
            }
            return ResponseEntity.ok(Map.of("filas", almacen.informeSql(limite)));
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
