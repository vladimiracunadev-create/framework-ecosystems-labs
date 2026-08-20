package labs;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@SpringBootApplication
@RestController
public class Aplicacion {

    static final int CUPO = 3;
    static final long VENTANA_MS = 60_000L;

    static final class Cubo {
        int restantes = CUPO;
        long reinicio = Instant.now().toEpochMilli() + VENTANA_MS;
    }

    /**
     * Spring Boot no trae limitacion de tasa: se monta a mano o se anade otra
     * pieza. El cubo vive en un mapa concurrente PORQUE varios hilos atienden
     * peticiones a la vez — un HashMap normal aqui seria un fallo de
     * concurrencia, no un detalle de estilo.
     *
     * Y sigue siendo estado POR PROCESO: con dos instancias, el cupo real es el
     * doble del declarado.
     */
    @Component
    public static class Limitador implements Filter {
        private final ConcurrentHashMap<String, Cubo> cubos = new ConcurrentHashMap<>();

        @Override
        public void doFilter(ServletRequest peticion, ServletResponse respuesta, FilterChain cadena)
                throws IOException, ServletException {
            HttpServletRequest p = (HttpServletRequest) peticion;
            HttpServletResponse r = (HttpServletResponse) respuesta;

            String clave = p.getRemoteAddr() == null ? "anonimo" : p.getRemoteAddr();
            Cubo cubo = cubos.computeIfAbsent(clave, k -> new Cubo());

            boolean permitido;
            long segundos;
            synchronized (cubo) {
                long ahora = Instant.now().toEpochMilli();
                if (ahora >= cubo.reinicio) {
                    cubo.restantes = CUPO;
                    cubo.reinicio = ahora + VENTANA_MS;
                }
                permitido = cubo.restantes > 0;
                if (permitido) {
                    cubo.restantes--;
                }
                segundos = Math.max(0, (cubo.reinicio - ahora + 999) / 1000);
                r.setHeader("RateLimit-Limit", String.valueOf(CUPO));
                r.setHeader("RateLimit-Remaining", String.valueOf(cubo.restantes));
                r.setHeader("RateLimit-Reset", String.valueOf(segundos));
            }

            if (!permitido) {
                r.setStatus(429);
                r.setHeader("Retry-After", String.valueOf(segundos));
                r.setContentType("application/problem+json");
                r.getWriter().write("{\"type\":\"about:blank\",\"title\":\"demasiadas peticiones\","
                        + "\"status\":429,\"code\":\"CUPO_AGOTADO\"}");
                return;
            }

            cadena.doFilter(peticion, respuesta);
        }
    }

    @GetMapping("/datos")
    public Map<String, Object> datos() {
        return Map.of("ok", true);
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
