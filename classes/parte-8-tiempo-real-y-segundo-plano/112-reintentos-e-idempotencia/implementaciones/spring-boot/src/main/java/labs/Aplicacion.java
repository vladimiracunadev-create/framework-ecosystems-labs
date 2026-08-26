package labs;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

/**
 * REINTENTAR SIN CAUSAR DANO, CON SPRING BOOT.
 *
 * Spring tiene una pieza para la mitad del problema: `@Retryable`, de Spring
 * Retry, con espera creciente y tope declarados en la anotacion. Es la respuesta
 * mas completa de los cuatro para reintentar bien, y **no toca la otra mitad**.
 *
 * Y la otra mitad es la que importa. Reintentar bien reparte el dano mejor;
 * lo que lo evita es que reintentar no haga nada la segunda vez, y eso no lo
 * puede resolver ninguna anotacion: **la clave la tiene que poner quien pide**,
 * porque solo el sabe si dos peticiones son el mismo intento.
 *
 * Aqui los reintentos estan escritos a mano para que se vean al lado de la
 * idempotencia y se entienda que son cosas distintas.
 */
@SpringBootApplication
@RestController
public class Aplicacion {

    /** Los cobros hechos. */
    static final List<Map<String, Object>> COBROS = new ArrayList<>();

    /**
     * LA MEMORIA DE CLAVES, QUE ES TODA LA IDEA.
     *
     * Guarda, por clave, **la respuesta que ya se dio**. No basta con recordar
     * «esta clave ya paso»: hay que devolver lo mismo, porque quien reintenta
     * necesita el identificador del cobro tanto como el primero.
     *
     * Y tiene que caducar. Una clave guardada para siempre es una fuga de
     * memoria con forma de tabla.
     */
    static final Map<String, Map<String, Object>> CLAVES = new ConcurrentHashMap<>();

    static final int[] ESPERAS_MS = { 50, 100, 200 };

    @PostMapping("/cobros")
    public ResponseEntity<Map<String, Object>> cobrar(
            @RequestHeader(value = "Idempotency-Key", required = false) String clave,
            @RequestBody Map<String, Object> cuerpo) {
        int importe = cuerpo.get("importe") == null
                ? 30
                : Integer.parseInt(String.valueOf(cuerpo.get("importe")));

        // SIN CLAVE NO HAY NADA QUE HACER. El servidor no puede distinguir un
        // reintento de un cobro nuevo, y tiene que cobrar. Es correcto.
        if (clave != null && CLAVES.containsKey(clave)) {
            Map<String, Object> repetida = new LinkedHashMap<>(CLAVES.get(clave));
            repetida.put("repetida", true);
            return ResponseEntity.ok(repetida);
        }

        Map<String, Object> cobro = new LinkedHashMap<>();
        synchronized (COBROS) {
            cobro.put("id", "cobro-" + (COBROS.size() + 1));
            cobro.put("importe", importe);
            cobro.put("estado", "cobrado");
            COBROS.add(cobro);
        }
        if (clave != null) CLAVES.put(clave, cobro);

        Map<String, Object> cuerpoRespuesta = new LinkedHashMap<>(cobro);
        cuerpoRespuesta.put("repetida", false);
        return ResponseEntity.status(201).body(cuerpoRespuesta);
    }

    @GetMapping(value = "/cobros", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> listar() {
        int total = 0;
        synchronized (COBROS) {
            for (Map<String, Object> c : COBROS) total += (int) c.get("importe");
            Map<String, Object> salida = new LinkedHashMap<>();
            salida.put("cobros_totales", COBROS.size());
            salida.put("importe_total", total);
            salida.put("cobros", new ArrayList<>(COBROS));
            return salida;
        }
    }

    /** Una operacion que falla las dos primeras veces y funciona a la tercera. */
    static class OperacionInestable {
        int intentos = 0;

        String intentar() {
            intentos += 1;
            if (intentos < 3) throw new RuntimeException("el proveedor no contesta");
            return "hecho";
        }
    }

    private static int cobrosTotales(HttpClient cliente, String origen) throws Exception {
        String cuerpo = cliente.send(
                HttpRequest.newBuilder(URI.create(origen + "/cobros")).build(),
                HttpResponse.BodyHandlers.ofString()).body();
        int desde = cuerpo.indexOf("\"cobros_totales\":") + 17;
        int hasta = cuerpo.indexOf(",", desde);
        return Integer.parseInt(cuerpo.substring(desde, hasta).trim());
    }

    private static void cobrar(HttpClient cliente, String origen, String clave) throws Exception {
        HttpRequest.Builder constructor = HttpRequest.newBuilder(URI.create(origen + "/cobros"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"importe\":30}"));
        if (clave != null) constructor = constructor.header("Idempotency-Key", clave);
        cliente.send(constructor.build(), HttpResponse.BodyHandlers.ofString());
    }

    @GetMapping(value = "/idempotencia.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> idempotencia(@RequestHeader("Host") String anfitrion)
            throws Exception {
        String origen = "http://" + anfitrion;
        HttpClient cliente = HttpClient.newHttpClient();

        COBROS.clear();
        CLAVES.clear();
        for (int i = 0; i < 3; i++) cobrar(cliente, origen, "k-prueba");
        int conClave = cobrosTotales(cliente, origen);

        COBROS.clear();
        CLAVES.clear();
        for (int i = 0; i < 3; i++) cobrar(cliente, origen, null);
        int sinClave = cobrosTotales(cliente, origen);

        OperacionInestable operacion = new OperacionInestable();
        int intentos = 0;
        String resultado = null;
        int[] conElPrimero = { 0, ESPERAS_MS[0], ESPERAS_MS[1], ESPERAS_MS[2] };
        for (int espera : conElPrimero) {
            if (espera > 0) Thread.sleep(espera);
            intentos += 1;
            try {
                resultado = operacion.intentar();
                break;
            } catch (RuntimeException ignorado) {
                resultado = null;
            }
        }

        List<Integer> esperas = new ArrayList<>();
        for (int e : ESPERAS_MS) esperas.add(e);

        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("framework", "spring-boot");
        salida.put("con_clave_peticiones", 3);
        salida.put("con_clave_cobros", conClave);
        salida.put("sin_clave_peticiones", 3);
        salida.put("sin_clave_cobros", sinClave);
        salida.put("la_clave_evita_el_duplicado", conClave == 1 && sinClave == 3);
        salida.put("reintentos", intentos);
        salida.put("exito_tras_reintentos", "hecho".equals(resultado));
        salida.put("esperas_ms", esperas);
        salida.put("la_espera_crece", true);
        salida.put("donde_se_guarda_la_clave",
                "un mapa en memoria; en produccion, una tabla con indice unico");
        salida.put("que_hace_falta_para_que_valga",
                "guardar la RESPUESTA y no solo la clave, y ponerle caducidad: sin lo "
                        + "primero el reintento se queda sin identificador, sin lo segundo la "
                        + "tabla crece para siempre");
        salida.put("que_no_se_debe_reintentar",
                "lo que devuelve 4xx: un 400 no mejora por repetirlo; @Retryable deja "
                        + "declarar que excepciones si y cuales no");
        return salida;
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
