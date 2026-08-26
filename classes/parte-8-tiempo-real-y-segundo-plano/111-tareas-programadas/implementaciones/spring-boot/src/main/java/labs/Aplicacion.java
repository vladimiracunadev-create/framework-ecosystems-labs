package labs;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * TAREAS PROGRAMADAS CON SPRING BOOT.
 *
 * Spring es el que mejor resuelve la mitad facil: `@Scheduled` con una expresion
 * de calendario, `@EnableScheduling` para encenderlo, y ya esta. Es la pieza mas
 * completa de los cuatro y la que menos codigo pide.
 *
 * Y **no resuelve nada de la mitad dificil**. Dos instancias con la misma
 * anotacion disparan las dos. La respuesta de este ecosistema tiene nombre
 * propio —ShedLock, o Quartz con su almacen en base de datos— y hay que
 * anadirla: el framework no la trae.
 *
 * Por eso aqui el cerrojo esta escrito a mano, igual que en las otras tres. Lo
 * que se ve es lo que ShedLock hace por dentro, y es poco: intentar coger un
 * turno con caducidad antes de trabajar.
 */
@SpringBootApplication
@EnableScheduling
@RestController
public class Aplicacion {

    /** Cada cuanto se dispara. */
    static final int CADA_MS = 100;

    /** Cuantas veces dispara cada prueba. */
    static final int TICS = 5;

    /**
     * EL CERROJO, CON SU CADUCIDAD.
     *
     * La caducidad es la parte que convierte un cerrojo en algo operable: sin
     * ella, una instancia que muera con el turno cogido deja la tarea parada
     * para siempre, y nadie se entera hasta que alguien pregunta por el informe
     * que no llego.
     */
    static String duenio = null;
    static long hasta = 0;

    static synchronized boolean intentarCogerElTurno(String quien, long duracionMs) {
        long ahora = System.currentTimeMillis();
        if (duenio != null && hasta > ahora) return false;
        duenio = quien;
        hasta = ahora + duracionMs;
        return true;
    }

    /** Un programador. Dispara TICS veces y anota cuantas trabajo de verdad. */
    static void programador(String quien, boolean conCerrojo, List<String> ejecuciones)
            throws InterruptedException {
        for (int i = 0; i < TICS; i++) {
            Thread.sleep(CADA_MS);
            if (!conCerrojo || intentarCogerElTurno(quien, CADA_MS - 10)) {
                ejecuciones.add(quien);
            }
        }
    }

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String portada() {
        return "<!DOCTYPE html><html lang=\"es\"><head><meta charset=\"utf-8\">"
                + "<title>Programadas</title></head><body><h1>Tareas programadas</h1>"
                + "<p data-cada=\"" + CADA_MS + "\" data-instancias=\"2\">"
                + "dos instancias con el mismo temporizador</p></body></html>";
    }

    @GetMapping(value = "/programadas.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> programadas() throws Exception {
        // SIN CERROJO: las dos instancias trabajan en cada disparo.
        List<String> sinCerrojo = new CopyOnWriteArrayList<>();
        Thread a1 = new Thread(() -> {
            try {
                programador("A", false, sinCerrojo);
            } catch (InterruptedException ignorado) {
            }
        });
        Thread b1 = new Thread(() -> {
            try {
                programador("B", false, sinCerrojo);
            } catch (InterruptedException ignorado) {
            }
        });
        a1.start();
        b1.start();
        a1.join();
        b1.join();

        // CON CERROJO: solo una por disparo.
        duenio = null;
        hasta = 0;
        List<String> conCerrojo = new CopyOnWriteArrayList<>();
        Thread a2 = new Thread(() -> {
            try {
                programador("A", true, conCerrojo);
            } catch (InterruptedException ignorado) {
            }
        });
        Thread b2 = new Thread(() -> {
            try {
                programador("B", true, conCerrojo);
            } catch (InterruptedException ignorado) {
            }
        });
        a2.start();
        b2.start();
        a2.join();
        b2.join();

        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("framework", "spring-boot");
        salida.put("instancias", 2);
        salida.put("tics", TICS);
        salida.put("cada_ms", CADA_MS);
        salida.put("sin_cerrojo_ejecuciones", sinCerrojo.size());
        salida.put("con_cerrojo_ejecuciones", conCerrojo.size());
        salida.put("se_duplica_sin_cerrojo", sinCerrojo.size() == TICS * 2);
        salida.put("no_se_duplica_con_cerrojo", conCerrojo.size() == TICS);
        salida.put("el_cerrojo_caduca", true);
        salida.put("como_se_programa",
                "@Scheduled con expresion de calendario y @EnableScheduling: la pieza "
                        + "mas completa de los cuatro para la mitad facil");
        salida.put("donde_esta_el_cerrojo",
                "aqui, a mano; en produccion, ShedLock o Quartz con su almacen en base de datos");
        salida.put("que_haria_falta_en_produccion",
                "que el cerrojo viva fuera del proceso y que su caducidad sea mayor que "
                        + "lo que tarde la tarea");
        return salida;
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
