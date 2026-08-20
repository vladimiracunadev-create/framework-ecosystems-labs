package labs;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

@SpringBootApplication
@RestController
public class Aplicacion {

    static class Capa implements Filter {
        private final String nombre;

        Capa(String nombre) {
            this.nombre = nombre;
        }

        @Override
        @SuppressWarnings("unchecked")
        public void doFilter(ServletRequest peticion, ServletResponse respuesta, FilterChain cadena)
                throws IOException, ServletException {
            // Los atributos de la petición son el almacén por petición del
            // mundo de los servlets.
            List<String> traza = (List<String>) peticion.getAttribute("traza");
            if (traza == null) {
                traza = new ArrayList<>();
                peticion.setAttribute("traza", traza);
            }
            traza.add("entra:" + nombre);
            cadena.doFilter(peticion, respuesta);
            // Lo de aquí se ejecuta al volver, en orden inverso.
        }
    }

    /**
     * El orden NO es el de declaración: se declara con `setOrder`. Es más
     * verboso, y elimina la dependencia del orden en que Spring descubra los
     * componentes, que no está garantizado.
     */
    private static FilterRegistrationBean<Filter> registrar(String nombre, int orden) {
        FilterRegistrationBean<Filter> registro = new FilterRegistrationBean<>(new Capa(nombre));
        registro.setOrder(orden);
        return registro;
    }

    @Bean
    public FilterRegistrationBean<Filter> uno() {
        return registrar("uno", 1);
    }

    @Bean
    public FilterRegistrationBean<Filter> dos() {
        return registrar("dos", 2);
    }

    @Bean
    public FilterRegistrationBean<Filter> tres() {
        return registrar("tres", 3);
    }

    @GetMapping("/traza")
    @SuppressWarnings("unchecked")
    public Map<String, List<String>> ver(HttpServletRequest peticion) {
        List<String> traza = (List<String>) peticion.getAttribute("traza");
        traza.add("manejador");
        return Map.of("traza", traza);
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
