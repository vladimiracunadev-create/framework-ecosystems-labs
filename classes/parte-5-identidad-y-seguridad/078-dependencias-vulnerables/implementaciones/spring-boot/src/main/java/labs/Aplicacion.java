package labs;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Los dos ficheros de datos/ son DATOS congelados, no software instalado: el
// arbol de una aplicacion de 2017 y una instantanea de la base de avisos.
// Este laboratorio no instala bibliotecas vulnerables — audita datos sobre
// ellas, que es lo que hace un auditor de verdad.
@SpringBootApplication
@RestController
public class Aplicacion {

    private final Map<String, Object> arbol;
    private final Map<String, Object> base;

    @SuppressWarnings("unchecked")
    public Aplicacion() throws Exception {
        ObjectMapper mapeador = new ObjectMapper();
        try (InputStream a = getClass().getResourceAsStream("/datos/arbol.json");
                InputStream b = getClass().getResourceAsStream("/datos/avisos.json")) {
            arbol = mapeador.readValue(a, Map.class);
            base = mapeador.readValue(b, Map.class);
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> paquetes() {
        return (List<Map<String, Object>>) arbol.get("paquetes");
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> avisos() {
        return (List<Map<String, Object>>) base.get("avisos");
    }

    /**
     * Comparacion NUMERICA de versiones, componente a componente.
     *
     * Comparar versiones como texto es el error que convierte una auditoria
     * en un tranquilizante: "2.5.9" > "2.5.10" es CIERTO alfabeticamente, asi
     * que una comparacion textual declararia sana una version afectada. Un
     * componente que falta cuenta como cero: 2.5.10 < 2.5.10.1.
     */
    private static boolean menorQue(String a, String b) {
        String[] pa = a.split("\\.");
        String[] pb = b.split("\\.");
        int largo = Math.max(pa.length, pb.length);
        for (int i = 0; i < largo; i++) {
            int x = i < pa.length ? Integer.parseInt(pa[i]) : 0;
            int y = i < pb.length ? Integer.parseInt(pb[i]) : 0;
            if (x != y) {
                return x < y;
            }
        }
        return false;
    }

    @GetMapping("/dependencias")
    public Map<String, Object> dependencias() {
        List<Map<String, Object>> todos = paquetes();
        long directas = todos.stream().filter(p -> Boolean.TRUE.equals(p.get("directa"))).count();
        // El numero que sorprende la primera vez: lo que declaras y lo que
        // ejecutas no son la misma lista.
        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("directas", (int) directas);
        salida.put("total", todos.size());
        salida.put("paquetes", todos.stream().map(p -> p.get("nombre")).toList());
        return salida;
    }

    @GetMapping("/dependencias/{nombre}")
    public ResponseEntity<?> detalle(@PathVariable String nombre) {
        return paquetes().stream()
                .filter(p -> nombre.equals(p.get("nombre")))
                .findFirst()
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "no-esta-en-el-arbol")));
    }

    @GetMapping("/auditoria")
    public Map<String, Object> auditoria(@RequestParam(required = false) String version) {
        // `?version=` permite preguntar «¿y si actualizo?» sin tocar el arbol.
        List<Map<String, Object>> hallazgos = new ArrayList<>();
        for (Map<String, Object> aviso : avisos()) {
            Map<String, Object> paquete = paquetes().stream()
                    .filter(p -> aviso.get("paquete").equals(p.get("nombre")))
                    .findFirst().orElse(null);
            if (paquete == null) {
                continue;
            }
            String instalada = version != null ? version : paquete.get("version").toString();
            String fijada = aviso.get("fijada_en").toString();
            if (!menorQue(instalada, fijada)) {
                continue;
            }
            Map<String, Object> hallazgo = new LinkedHashMap<>();
            hallazgo.put("id", aviso.get("id"));
            hallazgo.put("paquete", paquete.get("nombre"));
            hallazgo.put("instalada", instalada);
            hallazgo.put("fijada_en", fijada);
            hallazgo.put("gravedad", aviso.get("gravedad"));
            // Si es transitiva, la actualizacion no se hace sobre ella sino
            // sobre quien la trajo.
            hallazgo.put("directa", paquete.get("directa"));
            hallazgo.put("traida_por", paquete.get("traida_por"));
            hallazgo.put("explotada_activamente",
                    Boolean.TRUE.equals(aviso.get("explotada_activamente")));
            hallazgos.add(hallazgo);
        }
        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("instantanea", base.get("instantanea"));
        salida.put("avisos_conocidos", avisos().size());
        salida.put("afectadas", hallazgos.size());
        salida.put("hallazgos", hallazgos);
        return salida;
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
