package labs;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

/**
 * EVENTOS DE DOMINIO CON SPRING BOOT.
 *
 * Spring es **el unico de los cuatro con un bus de eventos dentro del
 * framework**: `ApplicationEventPublisher` para publicar y `@EventListener` para
 * suscribirse. No hay que escribir nada, y los consumidores se descubren solos
 * al arrancar.
 *
 * Y con la comodidad vienen dos trampas que hay que conocer:
 *
 *   - **Es sincrono por omision.** El consumidor corre en el mismo hilo y dentro
 *     de la misma transaccion que quien publico. Eso puede ser exactamente lo que
 *     se quiere —que el correo no salga si la transaccion se deshace— o un
 *     desastre —que el alta espere a un proveedor lento—. Se cambia con `@Async`,
 *     y entonces cambia tambien lo que pasa con los errores.
 *   - **Si un consumidor lanza, el que publico se entera.** Por omision, la
 *     excepcion sube hasta `publishEvent` y rompe la peticion. Es lo contrario de
 *     lo que casi todo el mundo espera de un bus, y por eso aqui cada consumidor
 *     captura lo suyo — que es lo que las otras tres implementaciones hacen en el
 *     bucle de publicar.
 */
@SpringBootApplication
@RestController
public class Aplicacion {

    /** El evento. En Spring puede ser cualquier objeto: no hace falta heredar
     *  de nada desde la version 4.2. */
    public record UsuarioCreado(int id, String nombre) {
    }

    static final List<Map<String, Object>> USUARIOS = new CopyOnWriteArrayList<>();
    static final List<String> CORREOS = new CopyOnWriteArrayList<>();
    static final AtomicInteger ALTAS_CONTADAS = new AtomicInteger();
    static final List<String> FALLIDOS = new CopyOnWriteArrayList<>();
    /** Si el consumidor roto esta activo. En las otras tres implementaciones se
     *  suscribe y se quita; aqui los consumidores los descubre Spring al
     *  arrancar, asi que se enciende y se apaga con una bandera. */
    static volatile boolean elRotoEstaActivo = false;

    /** LOS DOS CONSUMIDORES, INDEPENDIENTES. Ninguno sabe del otro, y el alta no
     *  sabe de ninguno: solo publica. */
    @Component
    public static class Bienvenida {
        @EventListener
        public void al(UsuarioCreado evento) {
            CORREOS.add("bienvenida a " + evento.nombre());
        }
    }

    @Component
    public static class Estadisticas {
        @EventListener
        public void al(UsuarioCreado evento) {
            ALTAS_CONTADAS.incrementAndGet();
        }
    }

    /**
     * EL TERCERO, QUE REVIENTA A PROPOSITO.
     *
     * Captura su propio fallo. Sin ese `try`, la excepcion subiria hasta
     * `publishEvent` y rompiria el alta: es la trampa numero dos de Spring, y
     * verla escrita es la unica forma de acordarse de ella.
     */
    @Component
    public static class Roto {
        @EventListener
        public void al(UsuarioCreado evento) {
            if (!elRotoEstaActivo) return;
            try {
                throw new RuntimeException("este consumidor esta roto");
            } catch (RuntimeException error) {
                FALLIDOS.add("roto");
            }
        }
    }

    private final ApplicationEventPublisher publicador;

    public Aplicacion(ApplicationEventPublisher publicador) {
        this.publicador = publicador;
    }

    @PostMapping("/usuarios")
    public ResponseEntity<Map<String, Object>> crear(@RequestBody Map<String, Object> cuerpo) {
        Map<String, Object> usuario = new LinkedHashMap<>();
        usuario.put("id", USUARIOS.size() + 1);
        usuario.put("nombre", String.valueOf(cuerpo.getOrDefault("nombre", "sin nombre")));
        USUARIOS.add(usuario);
        // El alta hace lo suyo y anuncia lo que paso. No sabe quien escucha.
        publicador.publishEvent(
                new UsuarioCreado((int) usuario.get("id"), (String) usuario.get("nombre")));
        return ResponseEntity.status(201).body(usuario);
    }

    @GetMapping(value = "/efectos", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> efectos() {
        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("usuarios", USUARIOS.size());
        salida.put("correos_enviados", CORREOS.size());
        salida.put("altas_contadas", ALTAS_CONTADAS.get());
        salida.put("correos", new ArrayList<>(CORREOS));
        salida.put("consumidores_fallidos", new ArrayList<>(FALLIDOS));
        return salida;
    }

    private static void reiniciar() {
        USUARIOS.clear();
        CORREOS.clear();
        ALTAS_CONTADAS.set(0);
        FALLIDOS.clear();
    }

    private static Map<String, Integer> efectosDe(HttpClient cliente, String origen)
            throws Exception {
        String cuerpo = cliente.send(
                HttpRequest.newBuilder(URI.create(origen + "/efectos")).build(),
                HttpResponse.BodyHandlers.ofString()).body();
        Map<String, Integer> salida = new LinkedHashMap<>();
        salida.put("correos_enviados", leerEntero(cuerpo, "correos_enviados"));
        salida.put("altas_contadas", leerEntero(cuerpo, "altas_contadas"));
        return salida;
    }

    private static int leerEntero(String json, String campo) {
        int desde = json.indexOf("\"" + campo + "\":") + campo.length() + 3;
        int hasta = desde;
        while (hasta < json.length() && Character.isDigit(json.charAt(hasta))) hasta++;
        return Integer.parseInt(json.substring(desde, hasta));
    }

    private static int alta(HttpClient cliente, String origen, String nombre) throws Exception {
        return cliente.send(
                HttpRequest.newBuilder(URI.create(origen + "/usuarios"))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString("{\"nombre\":\"" + nombre + "\"}"))
                        .build(),
                HttpResponse.BodyHandlers.ofString()).statusCode();
    }

    @GetMapping(value = "/eventos.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> eventos(@RequestHeader("Host") String anfitrion) throws Exception {
        String origen = "http://" + anfitrion;
        HttpClient cliente = HttpClient.newHttpClient();

        elRotoEstaActivo = false;
        reiniciar();
        alta(cliente, origen, "Ada");
        Map<String, Integer> conLosDos = efectosDe(cliente, origen);

        elRotoEstaActivo = true;
        reiniciar();
        int estadoDelAlta = alta(cliente, origen, "Grace");
        Map<String, Integer> conUnoRoto = efectosDe(cliente, origen);

        elRotoEstaActivo = false;
        reiniciar();
        alta(cliente, origen, "Alan");
        Map<String, Integer> sinElRoto = efectosDe(cliente, origen);

        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("framework", "spring-boot");
        salida.put("consumidores", 2);
        salida.put("los_dos_reaccionaron",
                conLosDos.get("correos_enviados") == 1 && conLosDos.get("altas_contadas") == 1);
        salida.put("un_consumidor_roto_no_rompe_a_los_demas",
                conUnoRoto.get("correos_enviados") == 1 && conUnoRoto.get("altas_contadas") == 1);
        salida.put("la_peticion_no_falla", estadoDelAlta == 201);
        salida.put("quitar_un_consumidor_no_toca_al_emisor",
                sinElRoto.get("correos_enviados") == 1 && sinElRoto.get("altas_contadas") == 1);
        salida.put("el_emisor_no_conoce_a_los_consumidores", true);
        salida.put("como_se_publica",
                "ApplicationEventPublisher.publishEvent: el bus viene en el framework");
        salida.put("como_se_suscribe",
                "@EventListener en cualquier componente; Spring los descubre al arrancar");
        salida.put("es_sincrono", true);
        salida.put("que_pasa_si_un_consumidor_falla",
                "por omision la excepcion sube y ROMPE la peticion: hay que capturarla en "
                        + "cada consumidor, o marcarlos @Async");
        salida.put("que_haria_falta_en_produccion",
                "guardar el evento antes de publicarlo, para poder reintentar al consumidor "
                        + "que fallo; y decidir a proposito si va dentro de la transaccion");
        return salida;
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
