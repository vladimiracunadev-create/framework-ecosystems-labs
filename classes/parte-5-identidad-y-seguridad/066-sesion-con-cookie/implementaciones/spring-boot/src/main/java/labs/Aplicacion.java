package labs;

import java.util.Map;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    private static final Map<String, String> USUARIOS = Map.of("ana", "secreta123");

    @PostMapping("/entrar")
    public ResponseEntity<Map<String, String>> entrar(
            @RequestBody(required = false) Map<String, String> credenciales,
            HttpServletRequest peticion) {
        String usuario = credenciales == null ? "" : credenciales.getOrDefault("usuario", "");
        String clave = credenciales == null ? "" : credenciales.getOrDefault("clave", "");
        if (!clave.equals(USUARIOS.get(usuario))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "credenciales-invalidas"));
        }

        // El almacen de sesiones lo lleva Tomcat: HttpSession guarda en el
        // servidor y a la cookie solo viaja el identificador. `changeSessionId`
        // descarta el identificador con el que llego la peticion y emite uno
        // nuevo — la defensa contra la fijacion de sesion: si un atacante
        // planto un identificador antes del inicio, nunca queda autenticado.
        HttpSession sesion = peticion.getSession(true);
        peticion.changeSessionId();
        sesion.setAttribute("usuario", usuario);
        return ResponseEntity.ok(Map.of("usuario", usuario));
    }

    @GetMapping("/perfil")
    public ResponseEntity<Map<String, String>> perfil(HttpServletRequest peticion) {
        // `getSession(false)` no crea nada: una visita anonima no debe dejar
        // sesiones huerfanas ni recibir cookie.
        HttpSession sesion = peticion.getSession(false);
        Object usuario = sesion == null ? null : sesion.getAttribute("usuario");
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "no-autenticado"));
        }
        return ResponseEntity.ok(Map.of("usuario", usuario.toString()));
    }

    @PostMapping("/salir")
    public ResponseEntity<Void> salir(HttpServletRequest peticion, HttpServletResponse respuesta) {
        // `invalidate` borra la sesion del almacen del contenedor — la cookie
        // robada deja de abrir. Pero Tomcat NO le dice al navegador que tire
        // la suya: esa cookie de borrado hay que emitirla a mano.
        HttpSession sesion = peticion.getSession(false);
        if (sesion != null) {
            sesion.invalidate();
        }
        Cookie borrado = new Cookie("sesion", "");
        borrado.setMaxAge(0);
        borrado.setPath("/");
        respuesta.addCookie(borrado);
        return ResponseEntity.noContent().build();
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
