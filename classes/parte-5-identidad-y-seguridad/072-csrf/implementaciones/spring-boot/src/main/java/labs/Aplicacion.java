package labs;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

// Aqui la proteccion NO se escribe: se usa la de Spring Security. El
// CsrfFilter guarda el testigo en la sesion, espera el encabezado
// X-CSRF-TOKEN en cada peticion que muta, y responde 403 el solo cuando
// falta o no casa. Lo unico que hace este codigo es ENTREGAR el testigo al
// cliente en el cuerpo del login.
@SpringBootApplication
@RestController
public class Aplicacion {

    private static final Map<String, String> USUARIOS = Map.of("ana", "secreta123");
    private final Map<String, Integer> cuentas = new ConcurrentHashMap<>(Map.of("ana", 100));

    @Bean
    SecurityFilterChain cadena(HttpSecurity http) throws Exception {
        http
                // CSRF ACTIVO — la primera clase de la parte que no lo apaga.
                // El login queda fuera: es donde el cliente consigue su
                // primer testigo.
                .csrf(csrf -> csrf.ignoringRequestMatchers("/entrar"))
                // La autenticacion es la sesion manual de la clase 066; las
                // rutas comprueban al usuario, y el filtro CSRF corre antes.
                .authorizeHttpRequests(reglas -> reglas.anyRequest().permitAll());
        return http.build();
    }

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
        HttpSession sesion = peticion.getSession(true);
        peticion.changeSessionId();
        sesion.setAttribute("usuario", usuario);
        // El testigo lo genera y guarda Spring Security; aqui solo se lee
        // del atributo de la peticion y se entrega en el cuerpo.
        CsrfToken testigo = (CsrfToken) peticion.getAttribute("_csrf");
        return ResponseEntity.ok(Map.of("usuario", usuario, "csrf", testigo.getToken()));
    }

    private String usuarioActual(HttpServletRequest peticion) {
        HttpSession sesion = peticion.getSession(false);
        Object usuario = sesion == null ? null : sesion.getAttribute("usuario");
        return usuario == null ? null : usuario.toString();
    }

    @PostMapping("/transferir")
    public ResponseEntity<Map<String, Object>> transferir(
            @RequestBody(required = false) Map<String, Object> datos,
            HttpServletRequest peticion) {
        // Si esta peticion llego hasta aqui, el CsrfFilter ya acepto el
        // testigo: el 403 de los casos del atacante nunca toca este codigo.
        String usuario = usuarioActual(peticion);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "no-autenticado"));
        }
        int importe = datos == null ? 0 : ((Number) datos.getOrDefault("importe", 0)).intValue();
        int saldo = cuentas.merge(usuario, -importe, Integer::sum);
        return ResponseEntity.ok(Map.of("saldo", saldo));
    }

    @GetMapping("/saldo")
    public ResponseEntity<Map<String, Object>> saldo(HttpServletRequest peticion) {
        String usuario = usuarioActual(peticion);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "no-autenticado"));
        }
        // GET no muta y el filtro no le exige testigo: la defensa protege
        // las escrituras.
        return ResponseEntity.ok(Map.of("saldo", cuentas.get(usuario)));
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
