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

    private static final Map<String, String> PERSONA =
            Map.of("id", "1", "nombre", "Ada", "apellido", "Lovelace");

    private static Map<String, String> comoV1() {
        return Map.of("id", PERSONA.get("id"),
                "nombre", PERSONA.get("nombre") + " " + PERSONA.get("apellido"));
    }

    @GetMapping("/v1/personas/1")
    public Map<String, String> v1() {
        return comoV1();
    }

    @GetMapping("/v2/personas/1")
    public Map<String, String> v2() {
        return PERSONA;
    }

    /**
     * `headers = "X-Api-Version=2"` hace que Spring ENRUTE por la cabecera: son
     * dos metodos distintos para la misma ruta, y el despachador elige.
     *
     * Es mas limpio que un `if` dentro de un metodo, porque cada version es un
     * metodo independiente que se puede congelar, probar y borrar por separado.
     */
    @GetMapping(value = "/personas/1", headers = "X-Api-Version=2")
    public ResponseEntity<Map<String, String>> porCabeceraV2() {
        return ResponseEntity.ok().header("X-Api-Version", "2").body(PERSONA);
    }

    @GetMapping("/personas/1")
    public ResponseEntity<Map<String, String>> porCabecera(
            @RequestHeader(name = "X-Api-Version", required = false, defaultValue = "1")
            String version) {
        if (!"1".equals(version)) {
            return ResponseEntity.status(400).body(Map.of("code", "VERSION_DESCONOCIDA"));
        }
        return ResponseEntity.ok().header("X-Api-Version", "1").body(comoV1());
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
