package labs;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
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
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@SpringBootApplication
@RestController
public class Aplicacion {

    static final List<Map<String, Object>> REGISTRO = new ArrayList<>();

    @Component
    public static class Registro implements Filter {
        @Override
        public void doFilter(ServletRequest peticion, ServletResponse respuesta, FilterChain cadena)
                throws IOException, ServletException {
            long inicio = System.nanoTime();
            cadena.doFilter(peticion, respuesta);
            long duracion = System.nanoTime() - inicio;

            HttpServletRequest p = (HttpServletRequest) peticion;
            if (!"/registro".equals(p.getRequestURI())) {
                Map<String, Object> linea = new LinkedHashMap<>();
                linea.put("metodo", p.getMethod());
                linea.put("ruta", p.getRequestURI());
                linea.put("estado", ((HttpServletResponse) respuesta).getStatus());
                linea.put("medido", duracion >= 0);
                REGISTRO.add(linea);
            }
        }
    }

    @GetMapping("/ok")
    public Map<String, Object> ok() {
        return Map.of("ok", true);
    }

    @GetMapping("/falla")
    public org.springframework.http.ResponseEntity<Map<String, Object>> falla() {
        return org.springframework.http.ResponseEntity.status(500).body(Map.of("error", "roto"));
    }

    @GetMapping("/registro")
    public Map<String, Object> ver() {
        return Map.of("registro", REGISTRO);
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
