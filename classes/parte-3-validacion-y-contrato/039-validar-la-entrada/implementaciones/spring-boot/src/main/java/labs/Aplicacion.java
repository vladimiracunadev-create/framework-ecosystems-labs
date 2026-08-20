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
            /**
             * `Object` y no `Boolean` a proposito.
             *
             * Con `Boolean`, un `"si"` en el cuerpo falla al DESERIALIZAR —antes
             * de que la validacion exista— y Spring responde 400. Pero un tipo
             * equivocado es entrada invalida, no cuerpo ilegible: corresponde
             * 422.
             *
             * Es el precio de que el enlace ocurra antes que la validacion en
             * los frameworks tipados. Aceptar el valor crudo y comprobar el tipo
             * a mano es la forma de recuperar el codigo correcto.
             */
            Object completada) {
    }

    @PostMapping("/tareas")
    public ResponseEntity<Map<String, Object>> crear(@Valid @RequestBody Tarea tarea) {
        Object completada = tarea.completada();
        if (completada != null && !(completada instanceof Boolean)) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(Map.of("error", "completada debe ser booleano"));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "titulo", tarea.titulo().trim(),
                "completada", completada != null && (Boolean) completada));
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
