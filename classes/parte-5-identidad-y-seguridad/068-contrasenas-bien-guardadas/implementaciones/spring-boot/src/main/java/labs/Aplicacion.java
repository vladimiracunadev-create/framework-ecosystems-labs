package labs;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    // BCrypt con coste 12. El codificador genera la sal y la escribe dentro
    // del resumen ($2a$12$...): verificar no necesita configuracion, la lee
    // del propio resumen.
    private final BCryptPasswordEncoder codificador = new BCryptPasswordEncoder(12);

    // Usuario → resumen. La contrasena en claro no se guarda nunca.
    private final Map<String, String> usuarios = new ConcurrentHashMap<>();

    // Resumen senuelo: verificar contra el cuesta lo mismo que una
    // verificacion real, y el tiempo de respuesta no delata que usuarios
    // existen.
    private final String senuelo = codificador.encode("senuelo-que-nunca-coincide");

    @PostMapping("/usuarios")
    public ResponseEntity<Map<String, String>> registrar(
            @RequestBody(required = false) Map<String, String> credenciales) {
        String usuario = credenciales == null ? "" : credenciales.getOrDefault("usuario", "");
        String clave = credenciales == null ? "" : credenciales.getOrDefault("clave", "");
        if (usuario.isEmpty() || clave.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(Map.of("error", "faltan-campos"));
        }
        if (usuarios.containsKey(usuario)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "ya-existe"));
        }
        String resumen = codificador.encode(clave);
        usuarios.put(usuario, resumen);
        // La ventana de inspeccion del laboratorio: el contrato mide que la
        // misma clave produce resumenes distintos. En produccion no sale.
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("usuario", usuario, "resumen", resumen));
    }

    @PostMapping("/entrar")
    public ResponseEntity<Map<String, String>> entrar(
            @RequestBody(required = false) Map<String, String> credenciales) {
        String usuario = credenciales == null ? "" : credenciales.getOrDefault("usuario", "");
        String clave = credenciales == null ? "" : credenciales.getOrDefault("clave", "");
        String resumen = usuarios.getOrDefault(usuario, senuelo);
        boolean coincide = codificador.matches(clave, resumen);
        if (!coincide || !usuarios.containsKey(usuario)) {
            // «No existe» y «clave mala» responden igual: distinguirlos
            // regalaria la lista de usuarios.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "credenciales-invalidas"));
        }
        return ResponseEntity.ok(Map.of("usuario", usuario));
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
