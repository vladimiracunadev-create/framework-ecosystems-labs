package labs;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CyclicBarrier;

import javax.sql.DataSource;

import com.zaxxer.hikari.HikariDataSource;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * El grupo de conexiones, visto desde dentro.
 *
 * Una conexion a la base es un recurso caro: un socket, una sesion en el
 * servidor, memoria alli. Abrir una por peticion no escala, y por eso todo el
 * mundo usa un grupo — casi siempre sin saber que tamano tiene.
 *
 * En Spring Boot ese grupo es HikariCP, y esta puesto sin que nadie lo pida.
 */
@SpringBootApplication
@EnableJpaRepositories(considerNestedRepositories = true)
public class Aplicacion {

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

    @RestController
    public static class Controlador {

        private final HikariDataSource fuente;
        private final Tareas tareas;

        /**
         * Las conexiones pedidas prestadas y NO devueltas. Se guardan aqui para
         * que sigan fuera del grupo: una fuga es exactamente esto.
         */
        private final List<Connection> fugadas = Collections.synchronizedList(new ArrayList<>());

        public Controlador(DataSource fuente, Tareas tareas) {
            this.fuente = (HikariDataSource) fuente;
            this.tareas = tareas;
        }

        /**
         * `getActiveConnections()` es el numero de conexiones PRESTADAS ahora.
         *
         * Es el dato que conviene tener en un panel: si sube y no baja, hay una
         * fuga; si roza el maximo de forma sostenida, el grupo esta mal
         * dimensionado.
         */
        @GetMapping("/grupo")
        public Map<String, Object> grupo() {
            return Map.of(
                    "tamano", fuente.getHikariConfigMXBean().getMaximumPoolSize(),
                    "en_uso", fuente.getHikariPoolMXBean().getActiveConnections());
        }

        /**
         * Prestada, no regalada.
         *
         * El repositorio pide una conexion, la usa y la devuelve al terminar la
         * transaccion. Ese «y la devuelve» es toda la diferencia entre un
         * servicio que aguanta y uno que se para a la hora.
         */
        @GetMapping("/consulta")
        public Map<String, Object> consulta() {
            tareas.count();
            return Map.of("ok", true);
        }

        /**
         * Tres peticiones, dos conexiones. La tercera ESPERA — y entra.
         *
         * Esperar no es un fallo: es el grupo haciendo su trabajo. El problema
         * empieza cuando la espera se alarga tanto que el cliente se cansa.
         */
        @GetMapping("/tres-a-la-vez")
        public Map<String, Object> tresALaVez() throws InterruptedException {
            List<Long> esperas = Collections.synchronizedList(new ArrayList<>());
            CyclicBarrier salida = new CyclicBarrier(3);
            List<Thread> hilos = new ArrayList<>();
            for (int i = 0; i < 3; i++) {
                hilos.add(Thread.ofPlatform().start(() -> retener(300, esperas, salida)));
            }
            for (Thread hilo : hilos) {
                hilo.join();
            }
            long maxima = esperas.stream().mapToLong(Long::longValue).max().orElse(0L);
            return Map.of(
                    "completadas", esperas.size(),
                    "espero_alguna", maxima > 100,
                    "espera_maxima_ms", (int) maxima);
        }

        /**
         * Con las dos retenidas mas tiempo que la espera, la tercera FALLA.
         *
         * Y falla de forma declarada: Hikari lanza al agotarse
         * `connection-timeout`, y eso se traduce en un 503 con codigo. La
         * alternativa —esperar sin limite— convierte una base lenta en un
         * servicio colgado, porque cada peticion que espera retiene su hilo.
         */
        @GetMapping("/agotar")
        public ResponseEntity<Map<String, Object>> agotar() throws InterruptedException {
            CyclicBarrier salida = new CyclicBarrier(3);
            List<Thread> retenedores = new ArrayList<>();
            for (int i = 0; i < 2; i++) {
                retenedores.add(Thread.ofPlatform()
                        .start(() -> retener(2500, new ArrayList<>(), salida)));
            }
            esperarBarrera(salida);
            Thread.sleep(200); // el tiempo justo para que las dos esten prestadas

            ResponseEntity<Map<String, Object>> respuesta;
            try (Connection conexion = fuente.getConnection()) {
                conexion.createStatement().execute("SELECT 1");
                respuesta = ResponseEntity.ok(Map.of("ok", true));
            } catch (SQLException fallo) {
                respuesta = ResponseEntity.status(503).body(Map.of("code", "GRUPO_AGOTADO"));
            }

            for (Thread hilo : retenedores) {
                hilo.join();
            }
            return respuesta;
        }

        /**
         * UNA FUGA: pedir prestado y no devolver.
         *
         * No hay excepcion, no hay registro, no hay nada. El grupo simplemente
         * tiene una conexion menos para siempre, y el sintoma aparece horas
         * despues como «la aplicacion se cuelga por las tardes».
         *
         * Hikari sabe avisar de esto: `leakDetectionThreshold` registra un aviso
         * cuando una conexion lleva demasiado tiempo fuera.
         */
        @GetMapping("/fugar")
        public Map<String, Object> fugar() throws SQLException {
            fugadas.add(fuente.getConnection());
            return Map.of("fugadas", fugadas.size());
        }

        private void retener(long milisegundos, List<Long> esperas, CyclicBarrier salida) {
            esperarBarrera(salida);
            long inicio = System.nanoTime();
            try (Connection conexion = fuente.getConnection()) {
                esperas.add((System.nanoTime() - inicio) / 1_000_000);
                conexion.createStatement().execute("SELECT 1");
                Thread.sleep(milisegundos);
            } catch (SQLException | InterruptedException fallo) {
                Thread.currentThread().interrupt();
            }
        }

        private static void esperarBarrera(CyclicBarrier barrera) {
            try {
                barrera.await();
            } catch (Exception fallo) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
