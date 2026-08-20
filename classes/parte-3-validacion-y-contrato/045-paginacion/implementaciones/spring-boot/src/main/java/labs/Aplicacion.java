package labs;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    private static final List<Map<String, String>> TAREAS = IntStream.rangeClosed(1, 25)
            .mapToObj(i -> Map.of("id", String.format("%03d", i), "titulo", "tarea " + i))
            .map(m -> (Map<String, String>) new LinkedHashMap<>(m))
            .toList();

    @GetMapping("/tareas")
    public ResponseEntity<Map<String, Object>> listar(
            @RequestParam(defaultValue = "0") int desde,
            @RequestParam(defaultValue = "10") int limite) {
        if (desde < 0) {
            return ResponseEntity.status(422).body(Map.of("code", "DESDE_INVALIDO"));
        }
        if (limite < 1 || limite > 50) {
            return ResponseEntity.status(422).body(Map.of("code", "LIMITE_INVALIDO"));
        }

        int fin = Math.min(desde + limite, TAREAS.size());
        List<Map<String, String>> pagina = desde >= TAREAS.size() ? List.of()
                : TAREAS.subList(desde, fin);

        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("elementos", pagina);
        cuerpo.put("total", TAREAS.size());
        return ResponseEntity.ok(cuerpo);
    }

    @GetMapping("/tareas-cursor")
    public ResponseEntity<Map<String, Object>> porCursor(
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "10") int limite) {
        if (limite < 1 || limite > 50) {
            return ResponseEntity.status(422).body(Map.of("code", "LIMITE_INVALIDO"));
        }

        int inicio = 0;
        if (cursor != null) {
            int posicion = -1;
            for (int i = 0; i < TAREAS.size(); i++) {
                if (TAREAS.get(i).get("id").equals(cursor)) {
                    posicion = i;
                    break;
                }
            }
            if (posicion < 0) {
                return ResponseEntity.status(422).body(Map.of("code", "CURSOR_INVALIDO"));
            }
            inicio = posicion + 1;
        }

        int fin = Math.min(inicio + limite, TAREAS.size());
        List<Map<String, String>> pagina = inicio >= TAREAS.size() ? List.of()
                : TAREAS.subList(inicio, fin);

        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("elementos", pagina);
        // `null` explicito cuando no hay mas: el cliente sabe que termino sin
        // tener que comparar tamanos.
        cuerpo.put("siguiente",
                inicio + limite < TAREAS.size() ? pagina.get(pagina.size() - 1).get("id") : null);
        return ResponseEntity.ok(cuerpo);
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
