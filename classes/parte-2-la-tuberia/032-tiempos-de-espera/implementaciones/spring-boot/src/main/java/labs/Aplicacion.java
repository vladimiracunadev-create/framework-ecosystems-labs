package labs;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.Callable;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.async.AsyncRequestTimeoutException;
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@RestController
public class Aplicacion {

    /**
     * El plazo solo aplica a manejadores ASINCRONOS: devolver `Callable` cede
     * el hilo del contenedor y permite que el despachador imponga el limite.
     * Un manejador sincrono bloquea su hilo y no hay plazo que valga — que es
     * la limitacion importante de este modelo.
     */
    @Configuration
    public static class Asincrono implements WebMvcConfigurer {
        @Override
        public void configureAsyncSupport(AsyncSupportConfigurer configurador) {
            configurador.setDefaultTimeout(300);
        }
    }

    @GetMapping("/rapido")
    public Callable<Map<String, Object>> rapido() {
        return () -> Map.of("ok", true);
    }

    @GetMapping("/lento")
    public Callable<Map<String, Object>> lento() {
        return () -> {
            Thread.sleep(1200);
            return Map.of("ok", true, "tarde", true);
        };
    }

    @RestControllerAdvice
    public static class Errores {
        // Spring 6 puede lanzar `AsyncRequestTimeoutException` o su subclase
        // `AsyncRequestNotUsableException` segun donde se detecte el plazo. Se
        // capturan las dos, o el 504 sale como 500.
        @ExceptionHandler({ AsyncRequestTimeoutException.class,
                org.springframework.web.context.request.async.AsyncRequestNotUsableException.class })
        public ResponseEntity<Map<String, Object>> plazo() {
            Map<String, Object> cuerpo = new LinkedHashMap<>();
            cuerpo.put("type", "about:blank");
            cuerpo.put("title", "el servidor tardo demasiado");
            cuerpo.put("status", 504);
            cuerpo.put("code", "TIEMPO_AGOTADO");
            return ResponseEntity.status(504)
                    .contentType(MediaType.valueOf("application/problem+json"))
                    .body(cuerpo);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
