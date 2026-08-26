package labs;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CopyOnWriteArraySet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.context.annotation.Configuration;

/**
 * RECONEXION Y MENSAJES PERDIDOS CON SPRING BOOT.
 *
 * Spring no reconecta por ti —eso es del cliente— y no guarda historial. Lo que
 * si tiene, y conviene saberlo porque cambia la conversacion, es la capa STOMP
 * con un intermediario de mensajes detras: con RabbitMQ o ActiveMQ, la
 * durabilidad y el «por donde iba» dejan de ser codigo de la aplicacion y pasan
 * a ser configuracion de la cola.
 *
 * Aqui se escribe a mano, como en las otras tres, por dos motivos: para que la
 * comparacion sea de la misma cosa, y porque **las veinte lineas de abajo son
 * exactamente lo que un intermediario de mensajes hace por dentro**. Entenderlas
 * es lo que permite elegir despues con criterio.
 */
@SpringBootApplication
@RestController
public class Aplicacion {

    /** EL HISTORIAL, QUE ES LO QUE HACE POSIBLE NO PERDER NADA. */
    private static final List<Map<String, Object>> HISTORIAL = new CopyOnWriteArrayList<>();
    private static final CopyOnWriteArraySet<WebSocketSession> SALA = new CopyOnWriteArraySet<>();
    private static int siguienteId = 1;

    private static synchronized Map<String, Object> emitir(String texto) {
        Map<String, Object> mensaje = new LinkedHashMap<>();
        mensaje.put("id", siguienteId);
        mensaje.put("texto", texto);
        siguienteId += 1;
        HISTORIAL.add(mensaje);
        for (WebSocketSession sesion : SALA) {
            try {
                if (sesion.isOpen()) {
                    sesion.sendMessage(new TextMessage(comoJson(mensaje)));
                }
            } catch (Exception ignorado) {
                SALA.remove(sesion);
            }
        }
        return mensaje;
    }

    private static String comoJson(Map<String, Object> mensaje) {
        return "{\"id\":" + mensaje.get("id") + ",\"texto\":\"" + mensaje.get("texto") + "\"}";
    }

    public static class Canal extends TextWebSocketHandler {

        @Override
        public void afterConnectionEstablished(WebSocketSession sesion) throws Exception {
            // LA REANUDACION. El cliente dice por cual iba en la consulta de la
            // URL, y el servidor le pone al dia antes de nada mas.
            int desde = 0;
            String consulta = sesion.getUri() == null ? null : sesion.getUri().getQuery();
            if (consulta != null && consulta.startsWith("desde=")) {
                desde = Integer.parseInt(consulta.substring("desde=".length()));
            }
            for (Map<String, Object> mensaje : HISTORIAL) {
                if ((int) mensaje.get("id") > desde) {
                    sesion.sendMessage(new TextMessage(comoJson(mensaje)));
                }
            }
            SALA.add(sesion);
        }

        @Override
        public void afterConnectionClosed(WebSocketSession sesion, CloseStatus estado) {
            SALA.remove(sesion);
        }
    }

    @Configuration
    @EnableWebSocket
    public static class Registro implements WebSocketConfigurer {
        @Override
        public void registerWebSocketHandlers(WebSocketHandlerRegistry registro) {
            registro.addHandler(new Canal(), "/ws").setAllowedOriginPatterns("*");
        }
    }

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String portada(@RequestHeader("Host") String anfitrion) {
        return "<!DOCTYPE html><html lang=\"es\"><head><meta charset=\"utf-8\">"
                + "<title>Reconexion</title></head><body><h1>Canal con historial</h1>"
                + "<p data-canal=\"ws://" + anfitrion + "/ws?desde=0\">"
                + "el canal, con el punto por donde se reanuda</p></body></html>";
    }

    /**
     * LA ESPERA CRECIENTE, ESCRITA PARA QUE SE VEA.
     *
     * Cada intento espera el doble que el anterior. Si todo el mundo reintenta
     * cada segundo, el servidor que se acaba de caer se vuelve a caer al
     * levantarse.
     *
     * Falta una cosa que un cliente serio si hace y aqui no: **ruido**. Si mil
     * clientes se cayeron a la vez, con esta tabla los mil reintentan a la vez, y
     * a los 100 milisegundos exactos. Sumar un azar de hasta el propio intervalo
     * es lo que evita esa avalancha, y se llama fluctuacion.
     */
    private static final int[] ESPERAS_MS = { 100, 200, 400 };

    /** Un cliente que guarda lo que le llega DESDE QUE SE CREA, no desde que se
     *  abre: al reanudar, el historial llega en cuanto el servidor acepta. */
    private static class Escucha implements WebSocket.Listener {
        final List<String> recibidos = Collections.synchronizedList(new ArrayList<>());

        @Override
        public CompletionStage<?> onText(WebSocket ws, CharSequence datos, boolean ultimo) {
            String texto = datos.toString();
            int desde = texto.indexOf("\"id\":") + 5;
            int hasta = texto.indexOf(",", desde);
            recibidos.add(texto.substring(desde, hasta));
            ws.request(1);
            return null;
        }
    }

    private static List<String> recoger(Escucha escucha, int cuantos, long milisegundos)
            throws InterruptedException {
        long limite = System.currentTimeMillis() + milisegundos;
        while (escucha.recibidos.size() < cuantos && System.currentTimeMillis() < limite) {
            Thread.sleep(20);
        }
        return new ArrayList<>(escucha.recibidos);
    }

    @GetMapping(value = "/reconexion.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> reconexion(@RequestHeader("Host") String anfitrion) throws Exception {
        HISTORIAL.clear();
        siguienteId = 1;
        HttpClient cliente = HttpClient.newHttpClient();

        Escucha escuchaPrimero = new Escucha();
        WebSocket primero = cliente.newWebSocketBuilder()
                .buildAsync(URI.create("ws://" + anfitrion + "/ws?desde=0"), escuchaPrimero).join();
        emitir("mensaje 1");
        emitir("mensaje 2");
        emitir("mensaje 3");
        List<String> recibidosAntes = recoger(escuchaPrimero, 3, 1500);

        // EL CORTE. Se cierra la conexion y el mundo sigue.
        primero.abort();
        Thread.sleep(50);
        emitir("mensaje 4");
        emitir("mensaje 5");

        List<Integer> esperasReales = new ArrayList<>();
        for (int espera : ESPERAS_MS) {
            long inicio = System.currentTimeMillis();
            Thread.sleep(espera);
            esperasReales.add((int) (System.currentTimeMillis() - inicio));
        }

        Escucha escuchaSegundo = new Escucha();
        WebSocket segundo = cliente.newWebSocketBuilder()
                .buildAsync(URI.create("ws://" + anfitrion + "/ws?desde=3"), escuchaSegundo).join();
        List<String> recibidosDespues = recoger(escuchaSegundo, 2, 1500);
        segundo.abort();

        List<String> todos = new ArrayList<>(recibidosAntes);
        todos.addAll(recibidosDespues);

        List<Integer> declaradas = new ArrayList<>();
        for (int e : ESPERAS_MS) declaradas.add(e);
        boolean crece = true;
        for (int i = 1; i < ESPERAS_MS.length; i++) {
            if (ESPERAS_MS[i] <= ESPERAS_MS[i - 1]) crece = false;
        }

        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("framework", "spring-boot");
        salida.put("recibidos_antes_del_corte", recibidosAntes);
        salida.put("emitidos_durante_el_corte", 2);
        salida.put("recibidos_al_reconectar", recibidosDespues);
        salida.put("ni_perdidos_ni_duplicados", String.join(",", todos).equals("1,2,3,4,5"));
        salida.put("ninguno_repetido", todos.size() == todos.stream().distinct().count());
        salida.put("esperas_declaradas_ms", declaradas);
        salida.put("esperas_reales_ms", esperasReales);
        salida.put("la_espera_crece", crece);
        salida.put("intentos_fallidos", ESPERAS_MS.length);
        salida.put("quien_reconecta",
                "quien escribe el cliente: Spring no reconecta, y el cliente de Java tampoco");
        salida.put("como_se_reanuda",
                "un parametro ?desde= en la URL del canal y un historial en el servidor; "
                        + "con STOMP y un intermediario de mensajes, esto seria configuracion");
        salida.put("lo_que_falta_para_produccion",
                "fluctuacion: sumar un azar a cada espera para que mil clientes caidos "
                        + "no reintenten a la vez");
        return salida;
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
