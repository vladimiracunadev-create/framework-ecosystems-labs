package labs;

import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.annotation.RequestScope;

@SpringBootApplication
public class Aplicacion {

    static final AtomicInteger CREADOS_UNICO = new AtomicInteger();
    static final AtomicInteger CREADOS_PETICION = new AtomicInteger();

    /** Ambito por omision en Spring: una sola instancia para todo el contexto. */
    @Component
    @Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
    static class ServicioUnico {
        final int id = CREADOS_UNICO.incrementAndGet();
    }

    /**
     * Por peticion. Spring inyecta un PROXY en el controlador —que es unico— y
     * el proxy resuelve la instancia real de cada peticion. Sin ese truco, un
     * objeto de vida larga no podria depender de uno de vida corta.
     */
    @Component
    @RequestScope
    static class ServicioPorPeticion {
        final int id = CREADOS_PETICION.incrementAndGet();
    }

    @RestController
    static class Controlador {
        private final ServicioUnico unico;
        private final ServicioPorPeticion porPeticion;

        Controlador(ServicioUnico unico, ServicioPorPeticion porPeticion) {
            this.unico = unico;
            this.porPeticion = porPeticion;
        }

        @GetMapping("/ambitos")
        public Map<String, Integer> ambitos() {
            return Map.of("unico", unico.id, "porPeticion", porPeticion.id);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
