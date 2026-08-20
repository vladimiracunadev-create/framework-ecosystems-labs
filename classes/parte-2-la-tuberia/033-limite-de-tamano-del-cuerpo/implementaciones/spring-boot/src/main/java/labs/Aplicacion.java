package labs;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@SpringBootApplication
@RestController
public class Aplicacion {

    static final int LIMITE = 1024;

    static class CuerpoExcedido extends RuntimeException {
    }

    /**
     * Se comprueba la longitud declarada ANTES de deserializar. Spring no trae
     * un limite de cuerpo para peticiones que no son multipart: hay que
     * ponerlo, o dejarselo al servidor de entrada.
     */
    @PostMapping("/tareas")
    public Map<String, Object> crear(HttpServletRequest peticion,
            @RequestBody(required = false) Map<String, Object> cuerpo) {
        if (peticion.getContentLengthLong() > LIMITE) {
            throw new CuerpoExcedido();
        }
        String serializado = cuerpo == null ? "{}" : cuerpo.toString();
        return Map.of("bytes", serializado.length());
    }

    @RestControllerAdvice
    public static class Errores {
        @ExceptionHandler(CuerpoExcedido.class)
        public ResponseEntity<Map<String, Object>> excedido() {
            Map<String, Object> cuerpo = new LinkedHashMap<>();
            cuerpo.put("type", "about:blank");
            cuerpo.put("title", "cuerpo demasiado grande");
            cuerpo.put("status", 413);
            cuerpo.put("code", "CUERPO_EXCEDIDO");
            return ResponseEntity.status(413)
                    .contentType(MediaType.valueOf("application/problem+json"))
                    .body(cuerpo);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
