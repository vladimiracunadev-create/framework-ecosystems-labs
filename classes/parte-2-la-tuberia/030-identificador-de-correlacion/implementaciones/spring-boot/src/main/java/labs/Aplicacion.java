package labs;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.MDC;

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

    @Component
    public static class Correlacion implements Filter {
        @Override
        public void doFilter(ServletRequest peticion, ServletResponse respuesta, FilterChain cadena)
                throws IOException, ServletException {
            HttpServletRequest p = (HttpServletRequest) peticion;
            String entrante = p.getHeader("X-Request-Id");
            String correlacion = (entrante != null && !entrante.isEmpty() && entrante.length() <= 128)
                    ? entrante
                    : UUID.randomUUID().toString();

            p.setAttribute("correlacion", correlacion);
            ((HttpServletResponse) respuesta).setHeader("X-Request-Id", correlacion);

            // El contexto de diagnóstico: a partir de aquí, TODA línea de
            // registro emitida en este hilo lleva el identificador sin que
            // ningún método tenga que pasarlo como argumento.
            MDC.put("correlacion", correlacion);
            try {
                cadena.doFilter(peticion, respuesta);
            } finally {
                // Obligatorio: el hilo vuelve al grupo y se reutiliza. Sin esta
                // limpieza, la siguiente petición heredaría el identificador de
                // la anterior.
                MDC.remove("correlacion");
            }
        }
    }

    @GetMapping("/eco")
    public Map<String, Object> eco(HttpServletRequest peticion) {
        return Map.of(
                "correlacion", peticion.getAttribute("correlacion"),
                "generado", peticion.getHeader("X-Request-Id") == null);
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
