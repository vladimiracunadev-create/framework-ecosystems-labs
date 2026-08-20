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
import org.springframework.validation.FieldError;
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

    public record Tarea(
            @NotBlank(message = "REQUERIDO|no puede estar vacio")
            @Size(max = 120, message = "LONGITUD|maximo 120 caracteres")
            String titulo,
            @Min(value = 1, message = "VALOR|debe ser 1, 2 o 3")
            @Max(value = 3, message = "VALOR|debe ser 1, 2 o 3")
            Integer prioridad) {
    }

    @PostMapping("/tareas")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> crear(@Valid @RequestBody Tarea tarea) {
        return Map.of("titulo", tarea.titulo().trim());
    }

    @RestControllerAdvice
    public static class Errores {
        /**
         * `getFieldErrors` devuelve TODOS los campos que fallaron, no el
         * primero. El codigo estable se codifica dentro del propio mensaje de
         * la anotacion, porque las anotaciones estandar no tienen un hueco para
         * un identificador de error.
         *
         * Es una limitacion real: en un proyecto serio se define una anotacion
         * propia con su campo de codigo.
         */
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, Object>> invalido(MethodArgumentNotValidException e) {
            List<Map<String, String>> errores = e.getBindingResult().getFieldErrors().stream()
                    .map(Errores::traducir)
                    .toList();

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

        private static Map<String, String> traducir(FieldError campo) {
            String mensaje = campo.getDefaultMessage();
            if (mensaje == null) {
                mensaje = "INVALIDO|invalido";
            }
            int corte = mensaje.indexOf('|');
            String codigo = corte > 0 ? mensaje.substring(0, corte) : "INVALIDO";
            String detalle = corte > 0 ? mensaje.substring(corte + 1) : mensaje;
            return Map.of("campo", campo.getField(), "codigo", codigo, "detalle", detalle);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
