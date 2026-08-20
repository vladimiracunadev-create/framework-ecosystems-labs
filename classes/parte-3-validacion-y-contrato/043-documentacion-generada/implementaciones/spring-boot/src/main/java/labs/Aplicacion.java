package labs;

import java.util.HashMap;
import java.util.Map;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@SpringBootApplication
@RestController
public class Aplicacion {

    private static final Map<String, Map<String, String>> TAREAS = new HashMap<>(
            Map.of("1", Map.of("id", "1", "titulo", "existente")));

    public record Tarea(@NotBlank @Size(max = 120) String titulo) {
    }

    /**
     * Los codigos se DECLARAN con `@ApiResponses`. springdoc documenta por su
     * cuenta el codigo de exito, y el 404 no lo puede adivinar: esta dentro de
     * un `if`, y ninguna herramienta lee la logica del metodo.
     *
     * Ahi esta el limite de "generado": se genera lo que esta en la FIRMA y en
     * las anotaciones, no lo que hace el cuerpo.
     */
    @GetMapping("/tareas/{id}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "La tarea"),
            @ApiResponse(responseCode = "404", description = "No existe"),
    })
    public ResponseEntity<Map<String, String>> obtener(@PathVariable("id") String id) {
        Map<String, String> tarea = TAREAS.get(id);
        if (tarea == null) {
            return ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"));
        }
        return ResponseEntity.ok(tarea);
    }

    @PostMapping("/tareas")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Creada"),
            @ApiResponse(responseCode = "422", description = "Entrada invalida"),
    })
    public ResponseEntity<Map<String, String>> crear(@Valid @RequestBody Tarea tarea) {
        String id = String.valueOf(TAREAS.size() + 1);
        Map<String, String> creada = Map.of("id", id, "titulo", tarea.titulo());
        TAREAS.put(id, creada);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
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
