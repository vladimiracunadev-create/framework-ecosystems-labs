package labs;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * LA MISMA RUTA, DOS VECES.
 *
 * `/idiomatico/tareas` esta escrita como se escribe en Spring: un registro con
 * anotaciones de validacion y `@Valid` en la firma. El framework rechaza lo
 * invalido antes de que el metodo exista.
 *
 * `/traducido/tareas` esta traducida desde Express — no la sintaxis, sino LA
 * SUPOSICION: que el cuerpo llega como un mapa y se comprueba a mano.
 *
 * Las dos compilan, las dos pasan el camino feliz, y una de las dos no usa el
 * framework para lo unico que el framework hacia aqui.
 */
@SpringBootApplication
@RestController
public class Aplicacion {

    private final List<Map<String, Object>> tareas = new ArrayList<>();

    // >>> idiomatico
    /**
     * Las reglas son ANOTACIONES sobre el tipo, no codigo en el controlador.
     *
     * `@NotBlank` es de Jakarta Bean Validation —un estandar, no de Spring— y
     * significa «no nulo y no vacio TRAS RECORTAR». Esa ultima parte es la que
     * la traduccion pierde.
     */
    public record Tarea(@NotBlank String titulo) {
    }

    @PostMapping("/idiomatico/tareas")
    public ResponseEntity<Map<String, Object>> crearIdiomatico(@Valid @RequestBody Tarea tarea) {
        return ResponseEntity.status(201).body(guardar(tarea.titulo().trim()));
    }
    // <<< idiomatico

    // >>> traducido
    /**
     * Traducida desde Express.
     *
     * `Map<String, Object>` es el equivalente exacto de `req.body`, y a partir de
     * ahi todo se comprueba a mano. Funciona.
     *
     * Lo que se pierde no es solo `"     "`: al declarar un mapa en lugar de un
     * tipo, el controlador deja de tener contrato. Nadie que lea la firma sabe
     * que espera esta ruta, ninguna herramienta puede documentarla, y el
     * compilador no puede ayudar. En un lenguaje tipado, renunciar al tipo es
     * renunciar a casi todo.
     */
    @PostMapping("/traducido/tareas")
    public ResponseEntity<Map<String, Object>> crearTraducido(
            @RequestBody(required = false) Map<String, Object> cuerpo) {
        Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
        if (titulo == null || titulo.toString().isEmpty()) {
            return ResponseEntity.status(422).body(Map.of("code", "TITULO_INVALIDO"));
        }
        return ResponseEntity.status(201).body(guardar(titulo.toString()));
    }
    // <<< traducido

    private Map<String, Object> guardar(String titulo) {
        Map<String, Object> tarea = new LinkedHashMap<>();
        tarea.put("id", tareas.size() + 1);
        tarea.put("titulo", titulo);
        tareas.add(tarea);
        return tarea;
    }

    @RestControllerAdvice
    public static class Errores {
        // Sin este manejador, Spring responde 400 con SU formato. El contrato
        // exige 422 con el nuestro.
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, String>> invalido(MethodArgumentNotValidException e) {
            return ResponseEntity.status(422).body(Map.of("code", "TITULO_INVALIDO"));
        }
    }

    @GetMapping("/tareas")
    public Map<String, Object> listar() {
        return Map.of("total", tareas.size(), "tareas", tareas);
    }

    @GetMapping("/tareas/{id}")
    public ResponseEntity<Map<String, Object>> leer(@PathVariable("id") int id) {
        for (Map<String, Object> tarea : tareas) {
            if (tarea.get("id").equals(id)) {
                return ResponseEntity.ok(tarea);
            }
        }
        return ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"));
    }

    /** Cuenta las lineas de codigo de un bloque leyendo ESTE archivo fuente. */
    private static int lineasEntre(String marca) {
        try {
            List<String> lineas = Files.readAllLines(
                    Path.of("src/main/java/labs/Aplicacion.java"), StandardCharsets.UTF_8);
            int desde = -1;
            int hasta = -1;
            for (int i = 0; i < lineas.size(); i++) {
                if (lineas.get(i).contains(">>> " + marca)) desde = i;
                if (lineas.get(i).contains("<<< " + marca)) hasta = i;
            }
            if (desde < 0 || hasta < 0) return 0;
            int cuenta = 0;
            for (String linea : lineas.subList(desde + 1, hasta)) {
                String limpia = linea.trim();
                if (!limpia.isEmpty() && !limpia.startsWith("*") && !limpia.startsWith("/")) {
                    cuenta++;
                }
            }
            return cuenta;
        } catch (Exception fallo) {
            return 0;
        }
    }

    /**
     * LA COMPARACION, MEDIDA.
     *
     * `mismo_camino_feliz` no esta escrito a mano: se pasa el mismo cuerpo valido
     * por las dos versiones y se comparan los resultados. Afirmar que coinciden
     * sin comprobarlo seria exactamente el error que esta clase ensena a evitar.
     */
    @GetMapping("/comparacion")
    public Map<String, Object> comparacion() {
        String entrada = "misma tarea";
        String porLaIdiomatica = new Tarea(entrada).titulo().trim();
        String porLaTraducida = entrada;

        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("mismo_camino_feliz", porLaIdiomatica.equals(porLaTraducida));
        salida.put("quien_valida_en_la_idiomatica", "jakarta bean validation, antes del metodo");
        salida.put("quien_valida_en_la_traducida", "nadie");
        salida.put("de_donde_viene_la_traduccion", "express");
        salida.put("tipo_del_cuerpo_en_la_idiomatica", Tarea.class.getSimpleName());
        salida.put("tipo_del_cuerpo_en_la_traducida", "Map");
        salida.put("lineas_idiomatico", lineasEntre("idiomatico"));
        salida.put("lineas_traducido", lineasEntre("traducido"));
        return salida;
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
