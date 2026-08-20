package labs;

import java.net.URI;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    private static ResponseEntity<Void> saltar(HttpStatus codigo, String destino) {
        return ResponseEntity.status(codigo).location(URI.create(destino)).build();
    }

    @GetMapping("/antigua")
    public ResponseEntity<Void> antigua() {
        return saltar(HttpStatus.MOVED_PERMANENTLY, "/nueva");
    }

    @GetMapping("/temporal")
    public ResponseEntity<Void> temporal() {
        return saltar(HttpStatus.FOUND, "/nueva");
    }

    @PostMapping("/temporal-estricta")
    public ResponseEntity<Void> estricta() {
        return saltar(HttpStatus.TEMPORARY_REDIRECT, "/nueva");
    }

    @GetMapping("/nueva")
    public Map<String, String> nueva() {
        return Map.of("destino", "nueva");
    }

    @PostMapping("/nueva")
    public Map<String, String> nuevaPost() {
        return Map.of("destino", "nueva", "metodo", "POST");
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
