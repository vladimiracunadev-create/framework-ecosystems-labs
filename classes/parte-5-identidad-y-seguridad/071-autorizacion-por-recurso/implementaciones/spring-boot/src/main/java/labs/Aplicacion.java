package labs;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

// Los DOS usuarios tienen el mismo rol: una comprobacion por rol los deja
// pasar a los dos. La pregunta de esta clase —¿es tuyo ESTE dato?— no se
// responde en la configuracion de Spring Security: se responde en la
// consulta, con el propietario en la condicion.
@SpringBootApplication
@RestController
public class Aplicacion {

    private record Tarea(String id, String titulo, String propietaria) {}

    private final Map<String, Tarea> tareas = new ConcurrentHashMap<>(Map.of(
            "1", new Tarea("1", "preparar informe", "ana"),
            "2", new Tarea("2", "revisar contrato", "luis")));

    // Buscar SIEMPRE con el propietario en la condicion. No es «buscar y
    // luego comprobar»: para este usuario, la tarea ajena directamente NO SE
    // ENCUENTRA. En SQL: WHERE id = ? AND propietaria = ?
    private Tarea buscar(String id, String usuario) {
        Tarea tarea = tareas.get(id);
        return tarea != null && tarea.propietaria().equals(usuario) ? tarea : null;
    }

    @Bean
    SecurityFilterChain cadena(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(reglas -> reglas.anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    UserDetailsService usuarios() {
        return new InMemoryUserDetailsManager(
                User.withUsername("ana").password("{noop}secreta123").roles("USUARIA").build(),
                User.withUsername("luis").password("{noop}secreta123").roles("USUARIA").build());
    }

    @GetMapping("/tareas")
    public Map<String, Object> listar(Principal actual) {
        List<Tarea> mias = tareas.values().stream()
                .filter(t -> t.propietaria().equals(actual.getName())).toList();
        return Map.of("total", mias.size(), "tareas", mias);
    }

    @GetMapping("/tareas/{id}")
    public ResponseEntity<?> detalle(@PathVariable String id, Principal actual) {
        Tarea tarea = buscar(id, actual.getName());
        // 404 y no 403: un 403 confirmaria que la tarea EXISTE, y los
        // identificadores son enumerables.
        if (tarea == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "no-encontrada"));
        }
        return ResponseEntity.ok(tarea);
    }

    @DeleteMapping("/tareas/{id}")
    public ResponseEntity<?> borrar(@PathVariable String id, Principal actual) {
        Tarea tarea = buscar(id, actual.getName());
        if (tarea == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "no-encontrada"));
        }
        tareas.remove(tarea.id());
        return ResponseEntity.noContent().build();
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
