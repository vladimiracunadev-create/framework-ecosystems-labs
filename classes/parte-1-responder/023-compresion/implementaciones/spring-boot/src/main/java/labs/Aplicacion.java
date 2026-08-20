package labs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    private static final String LARGO = "tarea pendiente. ".repeat(400);

    @GetMapping(value = "/grande", produces = MediaType.TEXT_PLAIN_VALUE)
    public String grande() {
        return LARGO;
    }

    @GetMapping(value = "/pequeno", produces = MediaType.TEXT_PLAIN_VALUE)
    public String pequeno() {
        return "corto";
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
