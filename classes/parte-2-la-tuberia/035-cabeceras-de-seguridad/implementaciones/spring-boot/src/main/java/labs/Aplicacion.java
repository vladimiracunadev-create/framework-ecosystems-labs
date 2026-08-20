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
     * Spring Security trae estas cabeceras puestas y bien. Aqui se ponen a mano
     * para que se vean: en un proyecto real, anadir Spring Security es la
     * respuesta correcta, y estas cinco vienen activadas por omision.
     */
    @Component
    public static class Endurecer implements Filter {
        @Override
        public void doFilter(ServletRequest peticion, ServletResponse respuesta, FilterChain cadena)
                throws IOException, ServletException {
            HttpServletResponse r = (HttpServletResponse) respuesta;
            r.setHeader("X-Content-Type-Options", "nosniff");
            r.setHeader("X-Frame-Options", "DENY");
            r.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            r.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
            r.setHeader("Referrer-Policy", "no-referrer");
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
