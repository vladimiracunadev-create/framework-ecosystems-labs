package labs;

import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@SpringBootApplication
@RestController
public class Aplicacion {

    /**
     * Dos vocabularios sobre el mismo campo: `jakarta.validation` para validar y
     * `@Schema` para documentar.
     *
     * Y aqui esta el matiz importante: springdoc LEE las anotaciones de
     * validacion y las traduce al esquema publicado. Asi que `@Size(max = 120)`
     * aparece en la documentacion aunque `@Schema` no lo repita.
     *
     * Es una fuente de verdad con dos capas de anotacion encima, no dos
     * declaraciones separadas.
     */
    public record Tarea(
            @Schema(description = "Que hay que hacer")
            @NotBlank @Size(max = 120) String titulo,

            @Schema(description = "1 alta, 3 baja", defaultValue = "2")
            @Min(1) @Max(3) Integer prioridad) {
    }

    @PostMapping("/tareas")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> crear(@Valid @RequestBody Tarea tarea) {
        return Map.of(
                "titulo", tarea.titulo(),
                "prioridad", tarea.prioridad() == null ? 2 : tarea.prioridad());
    }

    @RestControllerAdvice
    public static class Errores {
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, String>> invalido() {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(Map.of("code", "VALIDACION"));
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
