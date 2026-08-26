package labs;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.TimeUnit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
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

/**
 * WEBSOCKET CON SPRING BOOT.
 *
 * Spring es el unico de los cuatro donde el WebSocket es una PIEZA DEL
 * FRAMEWORK y no una biblioteca enganchada al servidor: se registra en la
 * configuracion, recibe inyeccion de dependencias, y los interceptores del
 * apreton pueden leer la sesion HTTP para saber quien se esta conectando. Eso
 * ultimo resuelve de serie el problema mas incomodo de esta tecnologia —la
 * autenticacion solo existe en el apreton— y en los otros tres hay que montarlo.
 *
 * Y trae ademas una capa mas arriba, STOMP, con destinos, suscripciones y
 * `@MessageMapping`. No se usa aqui a proposito: STOMP es a WebSocket lo que
 * Socket.IO es a WebSocket, y esta clase quiere ensenar el protocolo, no la capa
 * de encima. La comparacion entre las dos capas la hace Socket.IO en el elenco.
 */
@SpringBootApplication
@RestController
public class Aplicacion {

    /** LA LISTA DE CONEXIONES, A MANO. Es un conjunto en la memoria de ESTE
     *  proceso, y esa frase es el resumen del problema de la clase 109. */
    private static final CopyOnWriteArraySet<WebSocketSession> SALA = new CopyOnWriteArraySet<>();

    /** El manejador. `TextWebSocketHandler` ya se ocupa del troceado de los
     *  mensajes largos, que en `ws` y en Starlette hay que mirar a mano. */
    public static class Canal extends TextWebSocketHandler {

        @Override
        public void afterConnectionEstablished(WebSocketSession sesion) {
            SALA.add(sesion);
        }

        @Override
        protected void handleTextMessage(WebSocketSession sesion, TextMessage mensaje) throws Exception {
            String texto = mensaje.getPayload();
            // LA VUELTA: por la misma conexion que trajo el mensaje.
            sesion.sendMessage(new TextMessage("eco: " + texto));
            // Y LA DIFUSION: a todos los demas, recorriendo la lista a mano.
            for (WebSocketSession otra : SALA) {
                if (!otra.getId().equals(sesion.getId()) && otra.isOpen()) {
                    otra.sendMessage(new TextMessage("difusion: " + texto));
                }
            }
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
                + "<title>WebSocket</title></head><body><h1>Canal</h1>"
                + "<p data-canal=\"ws://" + anfitrion + "/ws\">el canal de esta pagina</p>"
                + "<script>const s = new WebSocket(\"ws://\" + location.host + \"/ws\");</script>"
                + "</body></html>";
    }

    /**
     * EL APRETON DE MANOS, HECHO A MANO Y CONTRA SI MISMO.
     *
     * Es la unica parte del protocolo que se puede comprobar con herramientas de
     * HTTP: a partir del 101 lo que viaja ya no es HTTP y ninguna de ellas lo
     * entiende. Con la clave de ejemplo del RFC 6455 la respuesta correcta es
     * siempre la misma, y por eso el contrato la puede exigir literal.
     */
    private static String[] apretonDeManos(String anfitrion, String ruta) {
        String[] partes = anfitrion.split(":");
        int puerto = partes.length > 1 ? Integer.parseInt(partes[1]) : 80;
        try (Socket enchufe = new Socket(partes[0], puerto)) {
            OutputStream salida = enchufe.getOutputStream();
            salida.write(("GET " + ruta + " HTTP/1.1\r\n"
                    + "Host: " + anfitrion + "\r\n"
                    + "Upgrade: websocket\r\n"
                    + "Connection: Upgrade\r\n"
                    + "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n"
                    + "Sec-WebSocket-Version: 13\r\n\r\n").getBytes(StandardCharsets.US_ASCII));
            salida.flush();
            BufferedReader lector = new BufferedReader(
                    new InputStreamReader(enchufe.getInputStream(), StandardCharsets.ISO_8859_1));
            String estado = lector.readLine().split(" ")[1];
            String aceptado = "";
            String linea;
            while ((linea = lector.readLine()) != null && !linea.isEmpty()) {
                int dosPuntos = linea.indexOf(": ");
                if (dosPuntos > 0
                        && linea.substring(0, dosPuntos).equalsIgnoreCase("Sec-WebSocket-Accept")) {
                    aceptado = linea.substring(dosPuntos + 2);
                }
            }
            return new String[] { estado, aceptado };
        } catch (Exception e) {
            return new String[] { "error", "" };
        }
    }

    /**
     * Un cliente que guarda lo que le llega.
     *
     * El cliente de WebSocket esta en la biblioteca estandar de Java desde la
     * version 11: no hace falta anadir nada. Devolver `null` desde `onText`
     * significa «no hay nada que esperar», que es lo que hace falta aqui.
     */
    private static class Escucha implements WebSocket.Listener {
        final List<String> recibidos = new ArrayList<>();
        final CompletableFuture<String> primero = new CompletableFuture<>();

        @Override
        public CompletionStage<?> onText(WebSocket ws, CharSequence datos, boolean ultimo) {
            recibidos.add(datos.toString());
            primero.complete(datos.toString());
            ws.request(1);
            return null;
        }
    }

    @GetMapping(value = "/ws.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> wsJson(@RequestHeader("Host") String anfitrion) throws Exception {
        String[] apreton = apretonDeManos(anfitrion, "/ws");

        HttpClient cliente = HttpClient.newHttpClient();
        Escucha escuchaPrimero = new Escucha();
        Escucha escuchaSegundo = new Escucha();
        WebSocket primero = cliente.newWebSocketBuilder()
                .buildAsync(URI.create("ws://" + anfitrion + "/ws"), escuchaPrimero).join();
        WebSocket segundo = cliente.newWebSocketBuilder()
                .buildAsync(URI.create("ws://" + anfitrion + "/ws"), escuchaSegundo).join();

        primero.sendText("hola", true);
        String recibido = escuchaPrimero.primero.get(2, TimeUnit.SECONDS);
        String recibidoPorElOtro = escuchaSegundo.primero.get(2, TimeUnit.SECONDS);
        primero.sendClose(WebSocket.NORMAL_CLOSURE, "");
        segundo.sendClose(WebSocket.NORMAL_CLOSURE, "");

        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("framework", "spring-boot");
        salida.put("ruta_del_canal", "/ws");
        salida.put("apreton_de_manos", apreton[0]);
        salida.put("accept_recibido", apreton[1]);
        salida.put("accept_es_correcto", "s3pPLMBiTxaQ9kYGzzhZRbK+xOo=".equals(apreton[1]));
        salida.put("enviado", "hola");
        salida.put("recibido", recibido);
        salida.put("segundo_cliente_recibio", recibidoPorElOtro);
        salida.put("mensajes_en_ambos_sentidos", true);
        salida.put("sobre_la_misma_conexion", true);
        salida.put("quien_guarda_las_conexiones",
                "quien escribe la aplicacion: un conjunto en la memoria de ESTE proceso");
        salida.put("como_se_monta",
                "registrando un manejador en la configuracion: es una pieza del framework, "
                        + "con inyeccion de dependencias y acceso a la sesion en el apreton");
        salida.put("lo_que_se_pierde_al_dejar_http",
                "las cabeceras solo valen para el apreton, y ninguna herramienta de HTTP "
                        + "puede leer lo que pasa despues");
        return salida;
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
