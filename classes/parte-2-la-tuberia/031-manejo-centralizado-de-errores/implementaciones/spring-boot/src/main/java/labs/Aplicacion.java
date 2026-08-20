package labs;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@SpringBootApplication
@RestController
public class Aplicacion {

    static class ErrorDeNegocio extends RuntimeException {
        final int estado;
        final String codigo;

        ErrorDeNegocio(String mensaje, int estado, String codigo) {
            super(mensaje);
            this.estado = estado;
            this.codigo = codigo;
        }
    }

    /**
     * `@RestControllerAdvice` aplica a TODOS los controladores. Es el punto
     * unico donde una excepcion se convierte en respuesta, sin que ningun
     * controlador tenga que saberlo.
     */
    @RestControllerAdvice
    public static class Errores {

        private static ResponseEntity<Map<String, Object>> problema(
                String titulo, int estado, String codigo) {
            Map<String, Object> cuerpo = new LinkedHashMap<>();
            cuerpo.put("type", "about:blank");
            cuerpo.put("title", titulo);
            cuerpo.put("status", estado);
            cuerpo.put("code", codigo);
            return ResponseEntity.status(estado)
                    .contentType(MediaType.valueOf("application/problem+json"))
                    .body(cuerpo);
        }

        @ExceptionHandler(ErrorDeNegocio.class)
        public ResponseEntity<Map<String, Object>> negocio(ErrorDeNegocio error) {
            return problema(error.getMessage(), error.estado, error.codigo);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<Map<String, Object>> noControlado(Exception error) {
            System.err.println("error no controlado: " + error.getMessage());
            return problema("error interno", 500, "ERROR_INTERNO");
        }
    }

    @GetMapping("/roto")
    public Map<String, Object> roto() {
        throw new IllegalStateException("referencia interna: secreto=abc123");
    }

    @GetMapping("/negocio")
    public Map<String, Object> negocio() {
        throw new ErrorDeNegocio("la tarea ya estaba completada", 409, "TAREA_YA_COMPLETADA");
    }

    @GetMapping("/ok")
    public Map<String, Object> ok() {
        return Map.of("ok", true);
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
