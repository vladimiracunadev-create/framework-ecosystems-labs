package labs;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    private static final List<String> REQUERIDAS = List.of("APP_ENTORNO", "APP_SECRETO");

    // Spring inyecta desde application.properties, que a su vez lee del
    // entorno. Si la variable no esta, el valor es cadena vacia — y el
    // validador del arranque lo caza.
    @Value("${app.entorno:}")
    private String entorno;

    @Value("${app.secreto:}")
    private String secreto;

    // Devuelve TODAS las que faltan, no la primera.
    private static List<String> validar(Map<String, String> fuente) {
        List<String> faltan = new ArrayList<>();
        for (String clave : REQUERIDAS) {
            String valor = fuente.get(clave);
            if (valor == null || valor.isEmpty()) {
                faltan.add(clave);
            }
        }
        return faltan;
    }

    // El arranque usa el mismo validador. Si falta algo, el contexto no
    // termina de levantar: fallar al arrancar es no fallar en la primera
    // peticion.
    @jakarta.annotation.PostConstruct
    void comprobarArranque() {
        Map<String, String> actual = new LinkedHashMap<>();
        actual.put("APP_ENTORNO", entorno);
        actual.put("APP_SECRETO", secreto);
        List<String> faltan = validar(actual);
        if (!faltan.isEmpty()) {
            throw new IllegalStateException("Configuracion incompleta, faltan: " + String.join(", ", faltan));
        }
    }

    @GetMapping("/configuracion")
    public Map<String, Object> configuracion() {
        // El secreto NUNCA sale: presencia, no valor.
        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("entorno", entorno);
        salida.put("secreto_presente", !secreto.isEmpty());
        salida.put("secreto", "****");
        return salida;
    }

    @PostMapping("/validar")
    public ResponseEntity<Map<String, Object>> validarEndpoint(
            @RequestBody(required = false) Map<String, String> cuerpo) {
        List<String> faltan = validar(cuerpo == null ? Map.of() : cuerpo);
        if (!faltan.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(Map.of("valida", false, "faltan", faltan));
        }
        return ResponseEntity.ok(Map.of("valida", true));
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
