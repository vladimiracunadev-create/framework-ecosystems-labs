package labs;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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

    private static Map<String, Object> mapa(Object... pares) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (int i = 0; i < pares.length; i += 2) {
            m.put(pares[i].toString(), pares[i + 1]);
        }
        return m;
    }

    @GetMapping("/rapido")
    public ResponseEntity<Map<String, Object>> rapido() {
        return ResponseEntity.ok(mapa("ok", true));
    }

    /**
     * El plazo se impone con `completeOnTimeout`, no con el mecanismo global de
     * Spring.
     *
     * La razon salio de dos intentos fallidos en integracion continua. Con el
     * plazo global —`spring.mvc.async.request-timeout` o `WebAsyncTask`— la
     * excepcion que Spring lanza al agotarse depende de la version y de donde se
     * detecte: hay al menos dos clases distintas, y un `@ExceptionHandler` que
     * no acierte con la correcta acaba devolviendo 500 en lugar de 504.
     *
     * `completeOnTimeout` elimina la ambiguedad: al vencer el plazo, el futuro
     * se completa CON EL VALOR que le das. No hay excepcion que traducir ni
     * pieza intermedia que adivinar.
     *
     * Lo que NO hace, y conviene saberlo: el trabajo de fondo sigue corriendo.
     * Es el mismo comportamiento que Express —dejar de esperar sin cancelar— y
     * el contrario al de FastAPI.
     */
    @GetMapping("/lento")
    public CompletableFuture<ResponseEntity<Map<String, Object>>> lento() {
        return CompletableFuture
                .supplyAsync(() -> {
                    try {
                        Thread.sleep(1200);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                    // `mapa(...)` y no `Map.of(...)`: este ultimo infiere
                    // `Map<String, Boolean>` y el tipo del futuro no encaja.
                    return ResponseEntity.ok(mapa("ok", true, "tarde", true));
                })
                .completeOnTimeout(plazoAgotado(), LIMITE_MS, TimeUnit.MILLISECONDS);
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
