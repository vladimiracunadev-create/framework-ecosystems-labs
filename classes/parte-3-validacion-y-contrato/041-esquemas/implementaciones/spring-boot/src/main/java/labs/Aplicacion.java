package labs;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@SpringBootApplication
@RestController
public class Aplicacion {

    /**
     * Jackson por omision IGNORA los campos que no conoce, asi que un cliente
     * que escribe mal el nombre de un campo no se entera: el dato se pierde en
     * silencio.
     *
     * La anotacion `@JsonIgnoreProperties(ignoreUnknown = false)` no basta sobre
     * un `record`: hay que activarlo en el deserializador, y eso se hace en
     * `application.properties` para TODA la aplicacion. Es menos fino que el
     * `extra="forbid"` de FastAPI, que se declara en el modelo concreto.
     */
    public record Tarea(
            @NotBlank(message = "REQUERIDO") @Size(max = 120, message = "LONGITUD") String titulo,
            @Min(value = 1, message = "VALOR") @Max(value = 3, message = "VALOR") Integer prioridad) {
    }

    @PostMapping("/tareas")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> crear(@Valid @RequestBody Tarea tarea) {
        return Map.of("titulo", tarea.titulo());
    }

    /** El esquema, publicado como dato para que el cliente pueda leerlo. */
    @GetMapping("/esquemas/tarea")
    public Map<String, Object> esquema() {
        Map<String, Object> titulo = new LinkedHashMap<>();
        titulo.put("type", "string");
        titulo.put("minLength", 1);
        titulo.put("maxLength", 120);

        Map<String, Object> prioridad = new LinkedHashMap<>();
        prioridad.put("type", "integer");
        prioridad.put("enum", List.of(1, 2, 3));

        Map<String, Object> propiedades = new LinkedHashMap<>();
        propiedades.put("titulo", titulo);
        propiedades.put("prioridad", prioridad);

        Map<String, Object> esquema = new LinkedHashMap<>();
        esquema.put("type", "object");
        esquema.put("required", List.of("titulo"));
        esquema.put("additionalProperties", false);
        esquema.put("properties", propiedades);
        return esquema;
    }

    @RestControllerAdvice
    public static class Errores {
        private static ResponseEntity<Map<String, Object>> problema(List<Map<String, String>> errores) {
            Map<String, Object> cuerpo = new LinkedHashMap<>();
            cuerpo.put("type", "about:blank");
            cuerpo.put("title", "la entrada no es valida");
            cuerpo.put("status", 422);
            cuerpo.put("code", "VALIDACION");
            cuerpo.put("errors", errores);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .contentType(MediaType.valueOf("application/problem+json"))
                    .body(cuerpo);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, Object>> invalido(MethodArgumentNotValidException e) {
            return problema(e.getBindingResult().getFieldErrors().stream()
                    .map(campo -> Map.of(
                            "campo", campo.getField(),
                            "codigo", campo.getDefaultMessage() == null ? "INVALIDO"
                                    : campo.getDefaultMessage()))
                    .toList());
        }

        /** Un campo desconocido llega como error de lectura, no de validacion. */
        @ExceptionHandler(HttpMessageNotReadableException.class)
        public ResponseEntity<Map<String, Object>> desconocido(HttpMessageNotReadableException e) {
            return problema(List.of(Map.of("campo", "cuerpo", "codigo", "DESCONOCIDO")));
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
