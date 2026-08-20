package labs;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
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

@SpringBootApplication
public class Aplicacion {

    static final List<String> AUDITORIA = new ArrayList<>();

    /** (1) EXTERNA — en el mundo de los servlets es un FILTRO. Ve la peticion cruda, sin saber su destino. */
    @Component
    public static class CapaFiltro implements Filter {
        @Override
        public void doFilter(ServletRequest peticion, ServletResponse respuesta, FilterChain cadena)
                throws IOException, ServletException {
            HttpServletRequest p = (HttpServletRequest) peticion;
            if (!"/auditoria".equals(p.getRequestURI())) {
                AUDITORIA.add("externa:" + p.getMethod() + " " + p.getRequestURI());
            }
            cadena.doFilter(peticion, respuesta);
        }
    }

    /**
     * (2) INTERNA — en Spring es un ASPECTO, el mas interno de los tres. No sabe nada de HTTP: se engancha
     * a la EJECUCION DE UN METODO, sea cual sea quien lo llame. Por eso el mismo
     * aspecto sirve para una peticion web, una tarea programada o una prueba.
     *
     * Es la diferencia de fondo: middleware y filtros viven en el transporte;
     * el aspecto vive en el codigo.
     */
    @Aspect
    @Component
    public static class CapaAspecto {
        @Around("execution(* labs.Aplicacion.Controlador.accion(..))")
        public Object auditar(ProceedingJoinPoint punto) throws Throwable {
            AUDITORIA.add("interna:" + punto.getSignature().getName());
            Object resultado = punto.proceed();
            AUDITORIA.add("interna:fin");
            return resultado;
        }
    }

    @RestController
    public static class Controlador {
        @GetMapping("/accion")
        public Map<String, Object> accion() {
            AUDITORIA.add("manejador");
            return Map.of("ok", true);
        }

        @GetMapping("/auditoria")
        public Map<String, Object> ver() {
            return Map.of("auditoria", AUDITORIA);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
