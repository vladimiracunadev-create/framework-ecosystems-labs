package labs;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.Callable;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.WebAsyncTask;

@SpringBootApplication
@RestController
public class Aplicacion {

    private static final long LIMITE_MS = 300L;

    private static ResponseEntity<Map<String, Object>> plazoAgotado() {
        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("type", "about:blank");
        cuerpo.put("title", "el servidor tardo demasiado");
        cuerpo.put("status", 504);
        cuerpo.put("code", "TIEMPO_AGOTADO");
        return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
                .contentType(MediaType.valueOf("application/problem+json"))
                .body(cuerpo);
    }

    @GetMapping("/rapido")
    public Callable<Map<String, Object>> rapido() {
        return () -> Map.of("ok", true);
    }

    /**
     * `WebAsyncTask` y no un `Callable` con plazo global.
     *
     * Con el plazo global, la excepcion que Spring lanza al agotarse depende de
     * la version y de donde se detecte —hay al menos dos clases distintas— y un
     * `@ExceptionHandler` que no acierte con la correcta acaba devolviendo 500.
     * El primer intento de esta clase fallaba asi.
     *
     * `onTimeout` elimina la ambiguedad: la respuesta del plazo se declara EN EL
     * MISMO SITIO que el trabajo, y no depende de que otra pieza traduzca una
     * excepcion. Es mas verboso y es la unica forma de que el codigo sea el que
     * quieres.
     */
    @GetMapping("/lento")
    public WebAsyncTask<ResponseEntity<Map<String, Object>>> lento() {
        Callable<ResponseEntity<Map<String, Object>>> trabajo = () -> {
            Thread.sleep(1200);
            return ResponseEntity.ok(Map.of("ok", true, "tarde", true));
        };

        WebAsyncTask<ResponseEntity<Map<String, Object>>> tarea =
                new WebAsyncTask<>(LIMITE_MS, trabajo);
        tarea.onTimeout(Aplicacion::plazoAgotado);
        return tarea;
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
