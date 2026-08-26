package labs;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

/**
 * EVENTOS ENVIADOS POR EL SERVIDOR CON SPRING BOOT.
 *
 * Spring tiene dos formas de hacer esto y conviene saber que son dos, porque se
 * confunden:
 *
 *   - `SseEmitter`, del modelo de servlets, que entrega el objeto a otro hilo
 *     para que vaya emitiendo. Es la mas conocida y **ocupa un hilo por
 *     cliente**, que es exactamente lo que no se quiere con mil conexiones
 *     abiertas.
 *   - `Flux<ServerSentEvent>`, del modelo reactivo, que no ocupa hilo mientras
 *     no haya nada que mandar. Es la buena para escala y trae WebFlux entero
 *     detras.
 *
 * Aqui se usa `StreamingResponseBody`, que es la tercera: escribir el texto a
 * mano. No es la mas idiomatica y es la que deja ver **que el formato son cuatro
 * reglas y ninguna magia**, que es lo que esta clase quiere ensenar. Las otras
 * dos producen exactamente los mismos bytes.
 */
@SpringBootApplication
@RestController
public class Aplicacion {

    /** Los eventos que hay que entregar. Cada uno tiene un numero de orden, y ese
     *  numero es lo que permite reanudar. */
    private static final List<Map<String, Object>> PEDIDOS = List.of(
            pedido(1, "Ada", 32),
            pedido(2, "Grace", 18),
            pedido(3, "Alan", 47));

    private static Map<String, Object> pedido(int id, String cliente, int importe) {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("id", id);
        p.put("cliente", cliente);
        p.put("importe", importe);
        return p;
    }

    /**
     * EL FORMATO, QUE SON CUATRO REGLAS Y NINGUNA MAS.
     *
     * Cada evento es un bloque de lineas `campo: valor` terminado en **una linea
     * en blanco**. Olvidar esa linea es el error numero uno: el navegador se
     * queda esperando y no entrega nada.
     */
    private static String comoEvento(Map<String, Object> p) {
        return "id: " + p.get("id") + "\n"
                + "event: pedido\n"
                + "data: {\"id\":" + p.get("id")
                + ",\"cliente\":\"" + p.get("cliente")
                + "\",\"importe\":" + p.get("importe") + "}\n\n";
    }

    @GetMapping(value = "/eventos", produces = "text/event-stream;charset=UTF-8")
    public ResponseEntity<StreamingResponseBody> eventos(
            @RequestHeader(value = "Last-Event-ID", required = false) String ultimoRecibido) {
        // LA REANUDACION, QUE ES LA MITAD DE LA CLASE. El navegador manda esta
        // cabecera solo, sin que nadie lo programe, con el identificador del
        // ultimo evento que recibio. Lo unico que hay que hacer es hacerle caso.
        final int ultimo = ultimoRecibido == null ? 0 : Integer.parseInt(ultimoRecibido);

        StreamingResponseBody cuerpo = salida -> {
            // Cuanto debe esperar el navegador antes de reconectar si esto se
            // corta. Se manda una vez y vale para toda la sesion.
            salida.write("retry: 2000\n\n".getBytes(StandardCharsets.UTF_8));
            salida.flush();
            for (Map<String, Object> p : PEDIDOS) {
                if ((int) p.get("id") > ultimo) {
                    salida.write(comoEvento(p).getBytes(StandardCharsets.UTF_8));
                    salida.flush();
                }
            }
            // El flujo se cierra a proposito al acabarse los eventos, para que el
            // contrato pueda leerlo entero. Uno real se quedaria abierto emitiendo
            // un comentario —`: latido`— cada treinta segundos.
        };

        return ResponseEntity.ok()
                // El `produces` de la anotacion no basta con un cuerpo de flujo:
                // Spring no negocia el tipo cuando lo que devuelve es un
                // `StreamingResponseBody`, y la respuesta sale sin `Content-Type`.
                // Se descubrio en integracion continua, con el contrato quejandose
                // de una cabecera vacia. Hay que ponerlo a mano.
                .contentType(MediaType.parseMediaType("text/event-stream;charset=UTF-8"))
                .header(HttpHeaders.CACHE_CONTROL, "no-cache")
                .header(HttpHeaders.CONNECTION, "keep-alive")
                // Sin esta, un nginx delante guarda la respuesta en un buffer y no
                // entrega nada hasta que se llena. Es el fallo clasico de esta
                // tecnologia y solo aparece en produccion.
                .header("X-Accel-Buffering", "no")
                .body(cuerpo);
    }

    @GetMapping(value = "/sse.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> sse(@RequestHeader("Host") String anfitrion) throws Exception {
        HttpClient cliente = HttpClient.newHttpClient();
        HttpResponse<String> flujo = cliente.send(
                HttpRequest.newBuilder(URI.create("http://" + anfitrion + "/eventos")).build(),
                HttpResponse.BodyHandlers.ofString());
        String texto = flujo.body();

        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("framework", "spring-boot");
        salida.put("tipo_de_contenido", flujo.headers().firstValue("content-type").orElse(""));
        salida.put("eventos_recibidos", texto.split("event: ", -1).length - 1);
        salida.put("bytes_del_flujo", texto.getBytes(StandardCharsets.UTF_8).length);
        salida.put("es_unidireccional", true);
        salida.put("reconecta_solo_el_navegador", true);
        salida.put("cabecera_de_reanudacion", "Last-Event-ID");
        salida.put("como_se_declara",
                "con StreamingResponseBody; el framework trae ademas SseEmitter "
                        + "y Flux<ServerSentEvent>, que producen los mismos bytes");
        salida.put("que_cuesta",
                "un hilo por conexion abierta en el modelo de servlets: mil clientes "
                        + "son mil hilos, y por eso existe WebFlux");
        salida.put("el_fallo_clasico",
                "un proxy inverso que guarda la respuesta en un buffer y no entrega nada");
        return salida;
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
