package labs;

import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class Aplicacion {

    interface Reloj {
        String ahora();
    }

    @Component
    static class RelojFijo implements Reloj {
        @Override
        public String ahora() {
            return "2026-01-01T00:00:00Z";
        }
    }

    @RestController
    static class Controlador {
        private final Reloj reloj;

        // Inyeccion por constructor. Desde Spring 4.3 no hace falta anotarlo:
        // si hay un solo constructor, el contenedor lo usa. Y por constructor y
        // no por campo, porque asi el objeto NO puede existir sin su
        // dependencia — el compilador lo garantiza.
        Controlador(Reloj reloj) {
            this.reloj = reloj;
        }

        @GetMapping("/ahora")
        public Map<String, String> ahora() {
            return Map.of("ahora", reloj.ahora(), "origen", "inyectado");
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
