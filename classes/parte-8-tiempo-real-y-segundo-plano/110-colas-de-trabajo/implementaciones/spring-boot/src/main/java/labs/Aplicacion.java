package labs;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

/**
 * COLAS DE TRABAJO CON SPRING BOOT.
 *
 * Spring tiene una anotacion para esto —`@Async`— y merece entenderla bien
 * porque es la que mas se usa mal:
 *
 *   - **Solo funciona a traves del proxy.** Llamar a un metodo `@Async` desde
 *     otro metodo de la MISMA clase no hace nada: se ejecuta igual de sincrono.
 *     Es el fallo numero uno con esta anotacion, y por eso aqui el trabajo vive
 *     en un `@Service` aparte.
 *   - **Hace falta `@EnableAsync`.** Sin ella, la anotacion se ignora en
 *     silencio: sin error, sin aviso, y todo sigue esperando.
 *   - **Usa un grupo de hilos.** Aqui si es paralelismo de verdad, al contrario
 *     que en Node o en Python, y eso significa que el grupo se puede agotar.
 *
 * Y lo mismo que en las otras tres: esto no es una cola. Si el proceso se
 * reinicia, lo pendiente desaparece. La respuesta de esta casa se llama Spring
 * Batch o Quartz para lo programado, y un intermediario de mensajes para lo
 * duradero.
 */
@SpringBootApplication
@EnableAsync
@RestController
public class Aplicacion {

    /** Lo que tarda el trabajo. */
    static final int TARDANZA_MS = 400;

    /** LA COLA, QUE AQUI ES UN MAPA Y EN PRODUCCION NO PUEDE SERLO. */
    static final Map<Integer, Map<String, Object>> TRABAJOS = new ConcurrentHashMap<>();
    static final AtomicInteger siguienteId = new AtomicInteger(1);

    /**
     * EL TRABAJADOR, EN SU PROPIA CLASE Y NO EN ESTA.
     *
     * No es un capricho de organizacion: `@Async` funciona porque Spring
     * envuelve el objeto en un proxy, y una llamada dentro de la misma clase no
     * pasa por el proxy. Ponerlo aqui haria que no ocurriera nada de lo que
     * promete la anotacion.
     */
    @Service
    public static class Trabajador {
        @Async
        public void hacer(int id, String descripcion) throws InterruptedException {
            TRABAJOS.get(id).put("estado", "en curso");
            Thread.sleep(TARDANZA_MS);
            TRABAJOS.get(id).put("estado", "terminada");
            TRABAJOS.get(id).put("resultado", "informe de " + descripcion);
        }
    }

    private final Trabajador trabajador;

    public Aplicacion(Trabajador trabajador) {
        this.trabajador = trabajador;
    }

    @PostMapping("/tareas")
    public ResponseEntity<Map<String, Object>> crear(@RequestBody Map<String, Object> cuerpo)
            throws Exception {
        String descripcion = String.valueOf(cuerpo.getOrDefault("descripcion", "sin nombre"));
        int id = siguienteId.getAndIncrement();
        Map<String, Object> trabajo = new LinkedHashMap<>();
        trabajo.put("id", id);
        trabajo.put("descripcion", descripcion);
        trabajo.put("estado", "encolada");
        trabajo.put("resultado", null);
        TRABAJOS.put(id, trabajo);

        trabajador.hacer(id, descripcion);

        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("id", id);
        respuesta.put("estado", "encolada");
        // 202 y no 200: **esto no esta hecho**. Y `Location` para que quien
        // pregunta no tenga que inventarse la URL donde mirar.
        return ResponseEntity.accepted()
                .header(HttpHeaders.LOCATION, "/tareas/" + id)
                .body(respuesta);
    }

    @GetMapping("/tareas/{id}")
    public ResponseEntity<Map<String, Object>> consultar(@PathVariable int id) {
        Map<String, Object> trabajo = TRABAJOS.get(id);
        if (trabajo == null) {
            return ResponseEntity.status(404).body(Map.of("error", "no existe"));
        }
        return ResponseEntity.ok(trabajo);
    }

    @GetMapping(value = "/cola.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> cola(@RequestHeader("Host") String anfitrion) throws Exception {
        String origen = "http://" + anfitrion;
        HttpClient cliente = HttpClient.newHttpClient();

        long inicio = System.currentTimeMillis();
        HttpResponse<String> encolada = cliente.send(
                HttpRequest.newBuilder(URI.create(origen + "/tareas"))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(
                                "{\"descripcion\":\"ventas de marzo\"}"))
                        .build(),
                HttpResponse.BodyHandlers.ofString());
        long msHastaLaRespuesta = System.currentTimeMillis() - inicio;

        String cuerpo = encolada.body();
        int id = Integer.parseInt(
                cuerpo.substring(cuerpo.indexOf("\"id\":") + 5, cuerpo.indexOf(",")));

        String estado = "encolada";
        while (!estado.equals("terminada") && System.currentTimeMillis() - inicio < 5000) {
            Thread.sleep(20);
            String actual = cliente.send(
                    HttpRequest.newBuilder(URI.create(origen + "/tareas/" + id)).build(),
                    HttpResponse.BodyHandlers.ofString()).body();
            estado = actual.contains("\"terminada\"") ? "terminada" : "en curso";
        }
        long msHastaTerminar = System.currentTimeMillis() - inicio;

        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("framework", "spring-boot");
        salida.put("estado_de_la_respuesta", encolada.statusCode());
        salida.put("tardanza_del_trabajo_ms", TARDANZA_MS);
        salida.put("ms_hasta_la_respuesta", msHastaLaRespuesta);
        salida.put("ms_hasta_terminar", msHastaTerminar);
        salida.put("la_respuesta_no_espera", msHastaLaRespuesta < TARDANZA_MS / 2);
        salida.put("se_pierde_al_reiniciar", true);
        salida.put("donde_vive_la_cola", "un mapa en la memoria de la maquina virtual");
        salida.put("como_se_encola",
                "@Async sobre un metodo de OTRA clase, con @EnableAsync puesta: sin "
                        + "las dos cosas la anotacion se ignora en silencio");
        salida.put("es_paralelismo", true);
        salida.put("que_haria_falta_en_produccion",
                "una cola fuera del proceso —un intermediario de mensajes— para que un "
                        + "reinicio no borre lo pendiente y para poder reintentar");
        return salida;
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
