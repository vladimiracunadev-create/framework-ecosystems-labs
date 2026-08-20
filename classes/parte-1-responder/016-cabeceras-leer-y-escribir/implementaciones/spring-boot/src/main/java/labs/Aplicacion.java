package labs;

import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    @GetMapping("/eco")
    public ResponseEntity<Map<String, String>> eco(
            @RequestHeader(name = "X-Peticion", required = false,
                    defaultValue = "(ninguna)") String recibido) {
        return ResponseEntity.ok()
                .header("X-Respuesta", "servida")
                .header("Cache-Control", "no-store")
                .body(Map.of("recibido", recibido));
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
