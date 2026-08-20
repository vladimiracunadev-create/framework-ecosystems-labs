package labs;

import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Spring Boot incrusta un servidor completo —Tomcat por omisión— dentro del
 * proceso. Entre el socket y este método hay: conector, contenedor de servlets,
 * despachador y cadena de filtros. Es la pila más profunda de las cinco.
 */
@SpringBootApplication
@RestController
public class Aplicacion {

    @GetMapping("/")
    public Map<String, String> raiz() {
        return Map.of("capa", "spring-boot");
    }

    @RestController
    static class Errores implements ErrorController {
        @RequestMapping("/error")
        public ResponseEntity<Map<String, String>> error() {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "no existe"));
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
