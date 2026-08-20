package labs;

import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    // `@PathVariable` enlaza el segmento con el argumento. Si los nombres
    // coinciden no hace falta repetirlo; se deja explícito porque el nombre del
    // argumento se pierde al compilar sin la opción de conservar parámetros.
    @GetMapping("/tareas/{id}")
    public Map<String, String> obtener(@PathVariable("id") String id) {
        return Map.of("id", id);
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
