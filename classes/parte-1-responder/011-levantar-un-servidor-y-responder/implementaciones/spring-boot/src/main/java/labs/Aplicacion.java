package labs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    @GetMapping(value = "/", produces = MediaType.TEXT_PLAIN_VALUE)
    public String raiz() {
        return "hola";
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
