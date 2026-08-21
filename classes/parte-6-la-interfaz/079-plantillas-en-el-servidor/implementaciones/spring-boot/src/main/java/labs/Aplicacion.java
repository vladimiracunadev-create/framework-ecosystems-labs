package labs;

import java.util.List;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

// `@Controller` y no `@RestController`: la diferencia es exactamente esta
// clase. `@RestController` devuelve el valor de retorno COMO CUERPO; un
// `@Controller` lo interpreta como el NOMBRE DE UNA VISTA que el motor de
// plantillas tiene que resolver.
@SpringBootApplication
@Controller
public class Aplicacion {

    // La tercera tarea es lo que un usuario escribio en un campo de texto.
    private static final List<Map<String, String>> TAREAS = List.of(
            Map.of("id", "1", "titulo", "comprar pan"),
            Map.of("id", "2", "titulo", "regar las plantas"),
            Map.of("id", "3", "titulo", "<script>alerta(1)</script>"));

    @GetMapping("/tareas")
    public String listar(Model modelo) {
        modelo.addAttribute("tareas", TAREAS);
        return "tareas";
    }

    @GetMapping("/tareas-crudo")
    public String listarCrudo(Model modelo) {
        modelo.addAttribute("tareas", TAREAS);
        return "tareas-crudo";
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
