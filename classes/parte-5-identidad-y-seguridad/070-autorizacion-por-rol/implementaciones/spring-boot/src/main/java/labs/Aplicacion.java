package labs;

import java.security.Principal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
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

@SpringBootApplication
@RestController
public class Aplicacion {

    private final Map<String, Map<String, String>> tareas = new ConcurrentHashMap<>(Map.of(
            "1", Map.of("id", "1", "titulo", "preparar informe"),
            "2", Map.of("id", "2", "titulo", "revisar contrato")));

    // La autorizacion vive en la CONFIGURACION, no en los controladores: las
    // reglas de quien puede que estan en un solo lugar y las rutas quedan
    // limpias. Es la propuesta de Spring Security — y tambien su critica:
    // la regla esta lejos del codigo que protege.
    @Bean
    SecurityFilterChain cadena(HttpSecurity http) throws Exception {
        http
                // Sin estado y sin formularios: API pura. El CSRF se apaga
                // aqui porque no hay cookies de sesion que proteger; la
                // clase 072 mide exactamente cuando NO se puede apagar.
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(reglas -> reglas
                        .requestMatchers("/panel").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/tareas/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults());
        return http.build();
    }

    // {noop} declara «sin resumen» — valido en el laboratorio, nunca en
    // produccion (clase 068). Spring convierte roles("ADMIN") en la
    // autoridad ROLE_ADMIN que hasRole("ADMIN") comprueba.
    @Bean
    UserDetailsService usuarios() {
        return new InMemoryUserDetailsManager(
                User.withUsername("ana").password("{noop}secreta123").roles("ADMIN").build(),
                User.withUsername("luis").password("{noop}secreta123").roles("LECTOR").build());
    }

    @GetMapping("/panel")
    public Map<String, String> panel(Principal actual) {
        return Map.of("usuario", actual.getName(), "rol", "admin");
    }

    @GetMapping("/tareas")
    public Map<String, Integer> listar() {
        return Map.of("total", tareas.size());
    }

    @DeleteMapping("/tareas/{id}")
    public ResponseEntity<Void> borrar(@PathVariable String id) {
        tareas.remove(id);
        return ResponseEntity.noContent().build();
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
