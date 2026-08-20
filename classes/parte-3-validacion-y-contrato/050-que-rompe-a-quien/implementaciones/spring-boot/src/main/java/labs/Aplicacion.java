package labs;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    private static boolean valido(Object titulo, int maximo) {
        return titulo instanceof String texto && !texto.isEmpty() && texto.length() <= maximo;
    }

    private static Map<String, Object> mapa(Object... pares) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (int i = 0; i < pares.length; i += 2) {
            m.put(pares[i].toString(), pares[i + 1]);
        }
        return m;
    }

    /** El contrato original. */
    @PostMapping("/v1/tareas")
    public ResponseEntity<Map<String, Object>> v1(@RequestBody Map<String, Object> cuerpo) {
        Object titulo = cuerpo.get("titulo");
        if (!valido(titulo, 200)) {
            return ResponseEntity.status(422).body(mapa("code", "VALIDACION"));
        }
        return ResponseEntity.status(201).body(mapa("id", "1", "titulo", titulo));
    }

    /**
     * Los tres cambios COMPATIBLES: campo opcional nuevo en la entrada, campo
     * nuevo en la salida, y un valor nuevo en un conjunto de salida.
     */
    @PostMapping("/v2/tareas")
    public ResponseEntity<Map<String, Object>> v2(@RequestBody Map<String, Object> cuerpo) {
        Object titulo = cuerpo.get("titulo");
        if (!valido(titulo, 200)) {
            return ResponseEntity.status(422).body(mapa("code", "VALIDACION"));
        }
        Object prioridad = cuerpo.getOrDefault("prioridad", 2);
        return ResponseEntity.status(201)
                .body(mapa("id", "1", "titulo", titulo, "prioridad", prioridad,
                        "estado", "pendiente"));
    }

    /**
     * Los tres INCOMPATIBLES: campo obligatorio nuevo, campo de salida
     * renombrado y validacion estrechada.
     */
    @PostMapping("/v3/tareas")
    public ResponseEntity<Map<String, Object>> v3(@RequestBody Map<String, Object> cuerpo) {
        if (!cuerpo.containsKey("prioridad")) {
            return ResponseEntity.status(422)
                    .body(mapa("code", "VALIDACION", "campo", "prioridad"));
        }
        Object titulo = cuerpo.get("titulo");
        if (!valido(titulo, 120)) {
            return ResponseEntity.status(422)
                    .body(mapa("code", "VALIDACION", "campo", "titulo"));
        }
        return ResponseEntity.status(201).body(mapa("id", "1", "nombre", titulo));
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
