package labs;

import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * La inversion de control sin ni siquiera una llamada de registro.
 *
 * En Express hay un `app.get(...)`; en FastAPI, un decorador. Aqui no hay
 * ninguna de las dos: hay una ANOTACION, que es un dato adjunto al metodo y no
 * ejecuta nada. Quien construye la tabla de rutas es el arranque, examinando
 * las clases del classpath.
 *
 * El contador demuestra que ese examen NO invoca el metodo: recien arrancada la
 * aplicacion vale cero.
 */
@SpringBootApplication
@RestController
public class Aplicacion {

    // AtomicInteger y no int: el contenedor de servlets atiende peticiones en
    // varios hilos, y esta es la primera clase donde eso ya importa.
    private final AtomicInteger veces = new AtomicInteger();

    @GetMapping(value = "/trabajo", produces = MediaType.TEXT_PLAIN_VALUE)
    public String manejarTrabajo() {
        veces.incrementAndGet();
        return "hecho";
    }

    @GetMapping("/invocaciones")
    public Map<String, Integer> invocaciones() {
        return Map.of("veces", veces.get());
    }

    public static void main(String[] args) {
        // La unica linea de este archivo que ejecuta algo. A partir de aqui el
        // control es del framework, para siempre.
        SpringApplication.run(Aplicacion.class, args);
    }
}
