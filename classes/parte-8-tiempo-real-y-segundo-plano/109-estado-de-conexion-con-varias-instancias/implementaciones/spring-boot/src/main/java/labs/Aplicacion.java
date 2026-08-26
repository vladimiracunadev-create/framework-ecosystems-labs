package labs;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.WebSocket;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.CopyOnWriteArraySet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * EL ESTADO DE CONEXION ES LOCAL, Y ESO SE ROMPE CON LA SEGUNDA INSTANCIA.
 *
 * Spring tiene una respuesta de fabrica para esto y merece nombrarla: con la
 * capa STOMP y un intermediario de mensajes de verdad detras —RabbitMQ,
 * ActiveMQ—, el reparto entre instancias deja de ser codigo de la aplicacion y
 * pasa a ser configuracion. Es lo mismo que el adaptador de Socket.IO, en el
 * mundo de la JVM.
 *
 * No se usa aqui por un motivo declarado: **haria falta montar un
 * intermediario**, y este laboratorio no levanta infraestructura para una clase.
 * Lo que se hace en su lugar es el reparto explicito, que es lo que ese
 * intermediario hace por dentro, y asi se ve.
 *
 * ── LAS DOS INSTANCIAS ────────────────────────────────────────────────────────
 *
 * Este archivo arranca DOS contextos de Spring en la misma maquina virtual, en
 * dos puertos, con **dos listas de conexiones separadas**. En produccion serian
 * dos procesos o dos maquinas: es lo unico simplificado, y no afecta a lo que se
 * mide porque lo que separa a las dos instancias —su estado en memoria— esta
 * separado de verdad.
 */
@SpringBootApplication
@RestController
public class Aplicacion {

    /** La lista de la instancia A. Una variable, no un almacen compartido. */
    static final CopyOnWriteArraySet<WebSocketSession> SALA_A = new CopyOnWriteArraySet<>();

    static int puertoA = 3000;
    static int puertoB = 3001;

    public static void entregar(CopyOnWriteArraySet<WebSocketSession> sala, String nombre, String texto) {
        for (WebSocketSession sesion : sala) {
            try {
                if (sesion.isOpen()) {
                    sesion.sendMessage(new TextMessage(
                            "{\"texto\":\"" + texto + "\",\"entregado_por\":\"" + nombre + "\"}"));
                }
            } catch (Exception ignorado) {
                sala.remove(sesion);
            }
        }
    }

    /** El manejador de la instancia A: guarda en SU lista. */
    public static class CanalA extends TextWebSocketHandler {
        @Override
        public void afterConnectionEstablished(WebSocketSession sesion) {
            SALA_A.add(sesion);
        }

        @Override
        public void afterConnectionClosed(WebSocketSession sesion, CloseStatus estado) {
            SALA_A.remove(sesion);
        }
    }

    @Configuration
    @EnableWebSocket
    public static class RegistroA implements WebSocketConfigurer {
        @Override
        public void registerWebSocketHandlers(WebSocketHandlerRegistry registro) {
            registro.addHandler(new CanalA(), "/ws").setAllowedOriginPatterns("*");
        }
    }

    /** La ruta que usa el reparto entre instancias. Es una ruta normal, y por eso
     *  se ve lo que el reparto es de verdad: **una peticion mas**. */
    @PostMapping("/interno")
    public Map<String, Object> interno(@RequestBody Map<String, Object> cuerpo) {
        entregar(SALA_A, "A", String.valueOf(cuerpo.get("texto")));
        return Map.of("entregado_por", "A");
    }

    @PostMapping("/publicar")
    public Map<String, Object> publicar(@RequestBody Map<String, Object> cuerpo) throws Exception {
        String texto = String.valueOf(cuerpo.get("texto"));
        entregar(SALA_A, "A", texto);
        // EL REPARTO. Con `bus`, se avisa a las demas instancias; sin el, no.
        //
        // Este reparto directo tiene dos limites que hay que saber: crece al
        // cuadrado con el numero de instancias, y si un par esta caido su gente
        // se pierde el mensaje sin que nadie se entere.
        if (Boolean.TRUE.equals(cuerpo.get("bus"))) {
            HttpClient cliente = HttpClient.newHttpClient();
            cliente.send(HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + puertoB + "/interno"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString("{\"texto\":\"" + texto + "\"}"))
                    .build(), HttpResponse.BodyHandlers.ofString());
        }
        return Map.of("publicado_en", "A", "con_bus", Boolean.TRUE.equals(cuerpo.get("bus")));
    }

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String portada() {
        return "<!DOCTYPE html><html lang=\"es\"><head><meta charset=\"utf-8\">"
                + "<title>Dos instancias</title></head><body><h1>Dos instancias</h1>"
                + "<p data-instancia=\"A\" data-canal=\"ws://127.0.0.1:" + puertoA + "/ws\">"
                + "esta instancia</p>"
                + "<p data-pares=\"http://127.0.0.1:" + puertoB + "\">las demas</p></body></html>";
    }

    private static class Escucha implements WebSocket.Listener {
        final List<String> recibidos = Collections.synchronizedList(new ArrayList<>());

        @Override
        public CompletionStage<?> onText(WebSocket ws, CharSequence datos, boolean ultimo) {
            recibidos.add(datos.toString());
            ws.request(1);
            return null;
        }
    }

    private static void publicarEnA(String texto, boolean bus) throws Exception {
        HttpClient cliente = HttpClient.newHttpClient();
        cliente.send(HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + puertoA + "/publicar"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(
                        "{\"texto\":\"" + texto + "\",\"bus\":" + bus + "}"))
                .build(), HttpResponse.BodyHandlers.ofString());
        Thread.sleep(200);
    }

    /**
     * LA DEMOSTRACION: EL MISMO MENSAJE, DOS VECES.
     *
     * Alguien conectado a la instancia B. El mensaje se publica siempre en la A.
     * Sin reparto no llega; con reparto, si.
     */
    @GetMapping(value = "/instancias.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> instancias() throws Exception {
        Escucha escucha = new Escucha();
        WebSocket enB = HttpClient.newHttpClient().newWebSocketBuilder()
                .buildAsync(URI.create("ws://127.0.0.1:" + puertoB + "/ws"), escucha).join();

        publicarEnA("hola sin bus", false);
        int sinBus = escucha.recibidos.size();

        publicarEnA("hola a todos", true);
        int conBus = escucha.recibidos.size();
        String ultimo = escucha.recibidos.isEmpty()
                ? ""
                : escucha.recibidos.get(escucha.recibidos.size() - 1);
        enB.abort();

        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("framework", "spring-boot");
        salida.put("instancias", 2);
        salida.put("el_estado_de_conexion_es_local", true);
        salida.put("sin_bus_recibio_el_otro", sinBus > 0);
        salida.put("con_bus_recibio_el_otro", conBus > sinBus);
        salida.put("mismo_mensaje", ultimo.contains("hola a todos") ? "hola a todos" : "");
        salida.put("entregado_por", ultimo.contains("\"B\"") ? "B" : "");
        salida.put("como_se_difunde",
                "aqui a mano; de fabrica se resuelve con STOMP y un intermediario de mensajes detras");
        salida.put("donde_esta_la_lista",
                "en un conjunto de cada contexto: una variable, no un almacen compartido");
        salida.put("que_haria_falta_en_produccion",
                "un intermediario de mensajes: con el, el reparto deja de ser codigo y pasa a ser configuracion");
        return salida;
    }

    public static void main(String[] args) {
        ConfigurableApplicationContext contextoA = SpringApplication.run(Aplicacion.class, args);
        puertoA = Integer.parseInt(
                contextoA.getEnvironment().getProperty("server.port", "3000"));
        puertoB = puertoA + 1;
        // LA SEGUNDA INSTANCIA. Otro contexto de Spring, otro puerto, otra lista.
        new SpringApplicationBuilder(otra.InstanciaB.class)
                .properties("server.port=" + puertoB)
                .run();
    }
}
