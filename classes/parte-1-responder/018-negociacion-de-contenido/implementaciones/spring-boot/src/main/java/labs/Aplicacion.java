package labs;

import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    // `produces` declara qué sabe servir cada método. Spring elige según Accept
    // y responde 406 por su cuenta si no hay ninguno compatible.
    @GetMapping(value = "/tareas/1", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> json() {
        return ResponseEntity.ok().header("Vary", "Accept")
                .body(Map.of("id", "1", "titulo", "negociar"));
    }

    @GetMapping(value = "/tareas/1", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> html() {
        return ResponseEntity.ok().header("Vary", "Accept").body("<h1>negociar</h1>");
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
