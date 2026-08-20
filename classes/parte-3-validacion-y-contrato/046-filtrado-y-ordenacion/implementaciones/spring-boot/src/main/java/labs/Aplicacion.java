package labs;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    record Tarea(String id, String titulo, int prioridad, boolean completada) {
    }

    private static final List<Tarea> TAREAS = List.of(
            new Tarea("1", "beta", 2, false),
            new Tarea("2", "alfa", 1, true),
            new Tarea("3", "gamma", 3, false));

    private static final Set<String> ORDENABLES = Set.of("titulo", "prioridad");
    private static final Set<String> FILTRABLES = Set.of("completada", "prioridad");

    private static Map<String, Object> comoMapa(Tarea t) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", t.id());
        m.put("titulo", t.titulo());
        m.put("prioridad", t.prioridad());
        m.put("completada", t.completada());
        return m;
    }

    @GetMapping("/tareas")
    public ResponseEntity<Map<String, Object>> listar(@RequestParam Map<String, String> consulta) {
        List<Tarea> resultado = new ArrayList<>(TAREAS);

        for (Map.Entry<String, String> entrada : consulta.entrySet()) {
            String campo = entrada.getKey();
            String valor = entrada.getValue();
            if ("orden".equals(campo)) {
                continue;
            }
            if (!FILTRABLES.contains(campo)) {
                return ResponseEntity.status(422)
                        .body(Map.of("code", "CAMPO_NO_FILTRABLE", "campo", campo));
            }
            if ("completada".equals(campo)) {
                if (!"true".equals(valor) && !"false".equals(valor)) {
                    return ResponseEntity.status(422)
                            .body(Map.of("code", "VALOR_INVALIDO", "campo", campo));
                }
                boolean esperado = Boolean.parseBoolean(valor);
                resultado.removeIf(t -> t.completada() != esperado);
            }
            if ("prioridad".equals(campo)) {
                int esperada;
                try {
                    esperada = Integer.parseInt(valor);
                } catch (NumberFormatException e) {
                    return ResponseEntity.status(422)
                            .body(Map.of("code", "VALOR_INVALIDO", "campo", campo));
                }
                resultado.removeIf(t -> t.prioridad() != esperada);
            }
        }

        String orden = consulta.get("orden");
        if (orden != null) {
            boolean descendente = orden.startsWith("-");
            String campo = descendente ? orden.substring(1) : orden;
            if (!ORDENABLES.contains(campo)) {
                return ResponseEntity.status(422)
                        .body(Map.of("code", "CAMPO_NO_ORDENABLE", "campo", campo));
            }
            // La lista blanca se traduce a un comparador CONOCIDO. Construir la
            // clausula con el texto del cliente seria la version de este
            // problema que acaba en inyeccion.
            Comparator<Tarea> comparador = "titulo".equals(campo)
                    ? Comparator.comparing(Tarea::titulo)
                    : Comparator.comparingInt(Tarea::prioridad);
            resultado.sort(descendente ? comparador.reversed() : comparador);
        }

        return ResponseEntity.ok(Map.of("elementos",
                resultado.stream().map(Aplicacion::comoMapa).toList()));
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
