package labs;

import java.io.IOException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import jakarta.servlet.http.HttpServletResponse;

@SpringBootApplication
@RestController
public class Aplicacion {

    // `StreamingResponseBody` libera el hilo del contenedor mientras se escribe:
    // sin él, un flujo largo retendría un hilo del grupo durante todo el envío.
    @GetMapping(value = "/flujo", produces = MediaType.TEXT_PLAIN_VALUE)
    public StreamingResponseBody flujo(HttpServletResponse respuesta) {
        respuesta.setHeader("Cache-Control", "no-store");
        return salida -> {
            for (String trozo : new String[] { "uno\n", "dos\n", "tres\n" }) {
                salida.write(trozo.getBytes());
                salida.flush();
                try {
                    Thread.sleep(50);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new IOException(e);
                }
            }
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
