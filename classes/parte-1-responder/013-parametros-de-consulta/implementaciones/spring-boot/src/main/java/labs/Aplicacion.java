package labs;

import java.util.Map;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@Validated
public class Aplicacion {

    // El valor por omisión y los límites son declarativos. Spring convierte el
    // texto al tipo del argumento y valida antes de entrar al método.
    @GetMapping("/tareas")
    public Map<String, Integer> listar(
            @RequestParam(name = "limite", defaultValue = "20") @Min(1) @Max(100) int limite) {
        return Map.of("limite", limite);
    }

    @ExceptionHandler({ jakarta.validation.ConstraintViolationException.class,
            org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class })
    public ResponseEntity<Map<String, String>> invalido() {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(Map.of("error", "limite debe ser un entero entre 1 y 100"));
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
