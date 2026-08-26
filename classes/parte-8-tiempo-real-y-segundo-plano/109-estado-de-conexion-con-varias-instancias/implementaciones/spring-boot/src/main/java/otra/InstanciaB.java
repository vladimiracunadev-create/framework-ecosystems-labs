/**
 * LA SEGUNDA INSTANCIA VIVE EN OTRO PAQUETE, Y NO ES UN CAPRICHO.
 *
 * Si estuviera en `labs`, el escaneo de componentes de la primera instancia la
 * encontraria y registraria sus rutas y su manejador TAMBIEN en el contexto A.
 * Las dos aplicaciones acabarian con dos mapeos de `/interno` y Spring se
 * negaria a arrancar.
 *
 * Que un paquete decida qué acaba dentro de qué contexto es la cara incomoda del
 * escaneo automatico: es comodo hasta que hay dos aplicaciones en la misma
 * maquina virtual.
 */
package otra;

import labs.Aplicacion;

import java.util.Map;
import java.util.concurrent.CopyOnWriteArraySet;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * LA SEGUNDA INSTANCIA, EN SU PROPIO CONTEXTO DE SPRING.
 *
 * Lo importante de este archivo es lo que NO comparte con el otro: `SALA_B` es
 * una lista distinta de `SALA_A`. Esa separacion es todo el problema de la
 * clase. Un mensaje entregado a la sala de la instancia A no llega a nadie de la
 * B, por muy sanos que esten los dos servidores.
 *
 * Que las dos vivan en la misma maquina virtual es lo unico simplificado. En
 * produccion serian dos procesos, y su estado estaria igual de separado: es
 * decir, exactamente igual de roto.
 */
@SpringBootApplication
@RestController
public class InstanciaB {

    /** La lista de la instancia B. Otra variable, en otro contexto. */
    static final CopyOnWriteArraySet<WebSocketSession> SALA_B = new CopyOnWriteArraySet<>();

    public static class CanalB extends TextWebSocketHandler {
        @Override
        public void afterConnectionEstablished(WebSocketSession sesion) {
            SALA_B.add(sesion);
        }

        @Override
        public void afterConnectionClosed(WebSocketSession sesion, CloseStatus estado) {
            SALA_B.remove(sesion);
        }
    }

    @Configuration
    @EnableWebSocket
    public static class RegistroB implements WebSocketConfigurer {
        @Override
        public void registerWebSocketHandlers(WebSocketHandlerRegistry registro) {
            registro.addHandler(new CanalB(), "/ws").setAllowedOriginPatterns("*");
        }
    }

    /** La ruta por la que la instancia A avisa a esta. Una peticion normal. */
    @PostMapping("/interno")
    public Map<String, Object> interno(@RequestBody Map<String, Object> cuerpo) {
        Aplicacion.entregar(SALA_B, "B", String.valueOf(cuerpo.get("texto")));
        return Map.of("entregado_por", "B");
    }
}
