package labs;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    private Map<String, String> tarea = nueva("original");

    private static Map<String, String> nueva(String titulo) {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("id", "1");
        m.put("titulo", titulo);
        return m;
    }

    private static String etiqueta(Map<String, String> valor) {
        try {
            String crudo = valor.get("id") + "|" + valor.get("titulo");
            byte[] resumen = MessageDigest.getInstance("SHA-256")
                    .digest(crudo.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (int i = 0; i < 8; i++) {
                hex.append(String.format("%02x", resumen[i]));
            }
            return "\"" + hex + "\"";
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    @GetMapping("/tareas/1")
    public ResponseEntity<Map<String, String>> obtener(
            @RequestHeader(name = "If-None-Match", required = false) String recibida) {
        String actual = etiqueta(tarea);
        if (actual.equals(recibida)) {
            // 304 sin cuerpo. `build()` lo garantiza.
            return ResponseEntity.status(304).eTag(actual).build();
        }
        return ResponseEntity.ok().eTag(actual).body(tarea);
    }

    @PutMapping("/tareas/1")
    public ResponseEntity<Map<String, String>> sustituir(
            @RequestHeader(name = "If-Match", required = false) String exigida,
            @RequestBody(required = false) Map<String, Object> cuerpo) {
        String actual = etiqueta(tarea);

        if (exigida == null) {
            return ResponseEntity.status(428).body(Map.of("code", "PRECONDICION_REQUERIDA"));
        }
        if (!exigida.equals(actual)) {
            return ResponseEntity.status(412).body(Map.of("code", "PRECONDICION_FALLIDA"));
        }

        Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
        tarea = nueva(titulo == null ? "" : titulo.toString());
        return ResponseEntity.ok().eTag(etiqueta(tarea)).body(tarea);
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
