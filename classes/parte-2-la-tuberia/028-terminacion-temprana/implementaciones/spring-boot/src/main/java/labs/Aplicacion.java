package labs;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

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

    static final AtomicInteger MANEJADOR = new AtomicInteger();

    @Component
    public static class Autenticacion implements Filter {
        @Override
        public void doFilter(ServletRequest peticion, ServletResponse respuesta, FilterChain cadena)
                throws IOException, ServletException {
            HttpServletRequest p = (HttpServletRequest) peticion;
            HttpServletResponse r = (HttpServletResponse) respuesta;

            if ("/publico".equals(p.getRequestURI())) {
                cadena.doFilter(peticion, respuesta);
                return;
            }

            // No llamar a `cadena.doFilter` corta la cadena.
            if (!"Bearer valido".equals(p.getHeader("Authorization"))) {
                r.setStatus(401);
                r.setHeader("WWW-Authenticate", "Bearer");
                r.setContentType("application/json");
                r.getWriter().write(
                        "{\"error\":\"no autorizado\",\"manejador\":" + MANEJADOR.get() + "}");
                return;
            }

            cadena.doFilter(peticion, respuesta);
        }
    }

    @GetMapping("/privado")
    public Map<String, Object> privado() {
        return Map.of("ok", true, "manejador", MANEJADOR.incrementAndGet());
    }

    @GetMapping("/publico")
    public Map<String, Object> publico() {
        return Map.of("ok", true, "publico", true);
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
