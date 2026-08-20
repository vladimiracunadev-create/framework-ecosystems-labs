package labs;

import java.io.IOException;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;

@SpringBootApplication
@RestController
public class Aplicacion {

    /**
     * En el mundo de los servlets el patrón se llama FILTRO, y `chain.doFilter`
     * es el `next()` de Express. Spring tiene además interceptores, que actúan
     * más adentro: después del enrutado y sabiendo qué método va a ejecutarse.
     */
    @Component
    public static class Capa implements Filter {
        @Override
        public void doFilter(ServletRequest peticion, ServletResponse respuesta, FilterChain cadena)
                throws IOException, ServletException {
            ((HttpServletResponse) respuesta).setHeader("X-Capa", "intermedia");
            cadena.doFilter(peticion, respuesta);
        }
    }

    @GetMapping("/a")
    public Map<String, String> a() {
        return Map.of("ruta", "a");
    }

    @GetMapping("/b")
    public Map<String, String> b() {
        return Map.of("ruta", "b");
    }

    @org.springframework.web.bind.annotation.ControllerAdvice
    public static class NoEncontrado {
        @org.springframework.web.bind.annotation.ExceptionHandler(
                org.springframework.web.servlet.NoHandlerFoundException.class)
        public org.springframework.http.ResponseEntity<Map<String, String>> manejar() {
            return org.springframework.http.ResponseEntity.status(404)
                    .body(Map.of("error", "no existe"));
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
