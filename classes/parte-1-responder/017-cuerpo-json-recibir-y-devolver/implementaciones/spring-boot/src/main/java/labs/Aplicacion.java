package labs;

import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    @PostMapping("/tareas")
    public ResponseEntity<Map<String, Object>> crear(@RequestBody Map<String, Object> cuerpo) {
        Object titulo = cuerpo.get("titulo");
        if (!(titulo instanceof String texto) || texto.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(Map.of("error", "titulo es obligatorio"));
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", "1", "titulo", texto, "completada", false));
    }

    // Sin este manejador, un cuerpo ilegible produce un 400 con el formato de
    // error de Spring, no con el del contrato.
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> ilegible() {
        return ResponseEntity.badRequest().body(Map.of("error", "cuerpo JSON mal formado"));
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
