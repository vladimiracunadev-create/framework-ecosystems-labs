package labs;

import java.util.Map;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@SpringBootApplication
@RestController
public class Aplicacion {

    /**
     * Las reglas son ANOTACIONES sobre el tipo, no codigo en el controlador.
     * El registro es inmutable: no puede existir a medio construir.
     */
    public record Tarea(
            @NotBlank(message = "titulo no puede estar vacio")
            @Size(max = 120, message = "titulo no puede pasar de 120 caracteres")
            String titulo,
            Boolean completada) {
    }

    @PostMapping("/tareas")
    public ResponseEntity<Map<String, Object>> crear(@Valid @RequestBody Tarea tarea) {
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "titulo", tarea.titulo().trim(),
                "completada", tarea.completada() != null && tarea.completada()));
    }

    @RestControllerAdvice
    public static class Errores {
        // Sin este manejador, Spring responde 400 con SU formato. El contrato
        // exige 422 con el nuestro.
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, String>> invalido(MethodArgumentNotValidException e) {
            String mensaje = e.getBindingResult().getFieldErrors().stream()
                    .findFirst()
                    .map(campo -> campo.getDefaultMessage())
                    .orElse("entrada invalida");
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(Map.of("error", mensaje));
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
