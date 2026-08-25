package labs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * El grado maximo de inversion de control del elenco.
 *
 * En Express y Flask hay una llamada o un decorador que REGISTRA la funcion.
 * Aqui no hay ni eso: hay una ANOTACION, que es un dato pegado al metodo. El
 * arranque examina las clases, encuentra las anotaciones y construye con ellas
 * la tabla de rutas. El codigo del programador no ejecuta nada.
 */
@SpringBootApplication
@RestController
public class Aplicacion {

    @GetMapping(value = "/saludo", produces = MediaType.TEXT_PLAIN_VALUE)
    public String saludo(@RequestParam(name = "nombre", required = false) String nombre) {
        // El parametro llega como argumento del metodo, ya decodificado y ya
        // convertido al tipo declarado. Ni se lee de una peticion ni se busca
        // en un diccionario: lo inyecta el framework.
        return nombre == null || nombre.isEmpty() ? "hola" : "hola " + nombre;
    }

    // Sin 404 escrito. Lo emite el DispatcherServlet cuando ningun metodo
    // anotado coincide con la peticion.

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
