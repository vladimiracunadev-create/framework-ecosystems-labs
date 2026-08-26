package labs;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

/**
 * SONDEO CON SPRING BOOT.
 *
 * Spring es el unico de los cuatro que trae la validacion condicional a mano
 * como parte del framework: `ResponseEntity` sabe lo que es un `ETag` y
 * `checkNotModified` sabe compararlo. Aqui se escribe el `if` a la vista, igual
 * que en los otros tres, para que la comparacion sea de la misma cosa — pero
 * conviene saber que existe `WebRequest.checkNotModified(etag)`, que hace lo
 * mismo en una linea y devuelve un booleano.
 *
 * Y hay un filtro que va todavia mas lejos: `ShallowEtagHeaderFilter` calcula el
 * ETag por su cuenta a partir del cuerpo. Ahorra el ancho de banda y no ahorra
 * NADA de trabajo, porque para calcularlo tiene que generar el cuerpo entero.
 * Es una distincion que se olvida a menudo y que aqui importa: una marca de
 * version barata —como la de esta clase— evita la consulta; una calculada del
 * cuerpo, no.
 */
@SpringBootApplication
@RestController
public class Aplicacion {

    /** El estado que se sondea. La version sube en cada cambio. */
    private int version = 1;
    private String valor = "tres pedidos";

    /** El identificador de la version actual, entre comillas como pide HTTP. */
    private String marca() {
        return "\"v" + version + "\"";
    }

    @GetMapping("/estado")
    public ResponseEntity<Map<String, Object>> estado(
            @RequestHeader(value = "If-None-Match", required = false) String siNoCoincide) {
        String actual = marca();

        // LA CONDICION, QUE ES TODA LA CLASE. Si quien pregunta ya tiene esta
        // version, se le dice que no hay nada nuevo: 304, sin cuerpo.
        if (actual.equals(siNoCoincide)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, actual)
                    .build();
        }

        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("version", version);
        cuerpo.put("valor", valor);
        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, actual)
                // `no-cache` no significa «no guardes»: significa «guardalo,
                // pero pregunta antes de usarlo».
                .header(HttpHeaders.CACHE_CONTROL, "no-cache")
                .contentType(MediaType.APPLICATION_JSON)
                .body(cuerpo);
    }

    @PostMapping("/cambiar")
    public Map<String, Object> cambiar() {
        version += 1;
        valor = (version + 2) + " pedidos";
        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("version", version);
        cuerpo.put("valor", valor);
        return cuerpo;
    }

    /**
     * UNA SESION DE SONDEO, MEDIDA POR EL PROPIO SERVIDOR.
     *
     * Seis preguntas: cinco sin novedad y una con ella. Es la proporcion real de
     * cualquier sondeo —casi todas las preguntas sobran— y es la razon de que el
     * condicional importe tanto.
     */
    @GetMapping("/sondeo.json")
    public Map<String, Object> sondeo(@RequestHeader("Host") String anfitrion) throws Exception {
        String origen = "http://" + anfitrion;
        int intervalo = 50;
        HttpClient cliente = HttpClient.newHttpClient();

        HttpResponse<String> primera = cliente.send(
                HttpRequest.newBuilder(URI.create(origen + "/estado")).build(),
                HttpResponse.BodyHandlers.ofString());
        String etiqueta = primera.headers().firstValue("etag").orElse("");

        int sinCambios = 0;
        int bytesSinCambios = 0;
        for (int i = 0; i < 5; i++) {
            Thread.sleep(intervalo);
            HttpResponse<String> r = cliente.send(
                    HttpRequest.newBuilder(URI.create(origen + "/estado"))
                            .header("If-None-Match", etiqueta)
                            .build(),
                    HttpResponse.BodyHandlers.ofString());
            if (r.statusCode() == 304) {
                sinCambios += 1;
                bytesSinCambios += r.body().getBytes(StandardCharsets.UTF_8).length;
            }
        }

        cliente.send(
                HttpRequest.newBuilder(URI.create(origen + "/cambiar"))
                        .POST(HttpRequest.BodyPublishers.noBody())
                        .build(),
                HttpResponse.BodyHandlers.ofString());
        HttpResponse<String> conNovedad = cliente.send(
                HttpRequest.newBuilder(URI.create(origen + "/estado"))
                        .header("If-None-Match", etiqueta)
                        .build(),
                HttpResponse.BodyHandlers.ofString());

        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("framework", "spring-boot");
        salida.put("intervalo_ms", intervalo);
        salida.put("sondeos", 6);
        salida.put("sin_cambios", sinCambios);
        salida.put("con_cambios", conNovedad.statusCode() == 200 ? 1 : 0);
        salida.put("peticiones_desperdiciadas", sinCambios);
        salida.put("bytes_de_cuerpo_sin_cambios", bytesSinCambios);
        salida.put("bytes_de_cuerpo_con_cambios",
                conNovedad.body().getBytes(StandardCharsets.UTF_8).length);
        salida.put("el_dato_llega_con_un_retraso_de_hasta_ms", intervalo);
        salida.put("como_se_declara_el_etag",
                "con ResponseEntity, que conoce el ETag; el framework trae ademas "
                        + "checkNotModified y un filtro que lo calcula del cuerpo");
        salida.put("que_no_arregla_el_condicional",
                "la ida y vuelta ocurre igual: se ahorra el cuerpo, no la peticion ni la latencia");
        salida.put("cuando_conviene",
                "cuando el retraso aceptable se mide en segundos y no en milisegundos, "
                        + "que es casi siempre");
        return salida;
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
