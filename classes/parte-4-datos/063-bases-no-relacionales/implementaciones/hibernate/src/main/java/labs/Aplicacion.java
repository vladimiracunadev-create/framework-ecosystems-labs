package labs;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableJpaRepositories(considerNestedRepositories = true)
public class Aplicacion {

    /**
     * TODO EL ESQUEMA. Un identificador y un texto.
     *
     * La forma de la tarea —titulo, etiquetas, autor— no esta aqui: esta en cada
     * documento. Es literalmente el cambio del que trata la clase.
     */
    @Entity
    @Table(name = "documentos")
    public static class Doc {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        public Long id;

        @Lob
        @Column(nullable = false)
        public String documento = "";
    }

    public interface Documentos extends JpaRepository<Doc, Long> {
    }

    private static final ObjectMapper JSON = new ObjectMapper();

    @SuppressWarnings("unchecked")
    private static Map<String, Object> leerJson(String texto) {
        try {
            return JSON.readValue(texto, Map.class);
        } catch (Exception fallo) {
            throw new IllegalStateException(fallo);
        }
    }

    private static String escribirJson(Object valor) {
        try {
            return JSON.writeValueAsString(valor);
        } catch (Exception fallo) {
            throw new IllegalStateException(fallo);
        }
    }

    @RestController
    public static class Controlador {

        private final Documentos documentos;
        private final JdbcTemplate jdbc;

        public Controlador(Documentos documentos, JdbcTemplate jdbc) {
            this.documentos = documentos;
            this.jdbc = jdbc;
        }

        @PostMapping("/tareas")
        public ResponseEntity<Map<String, Object>> crear(
                @RequestBody(required = false) Map<String, Object> cuerpo) {
            Map<String, Object> contenido = cuerpo == null ? Map.of() : cuerpo;
            Doc fila = new Doc();
            fila.documento = escribirJson(contenido);
            Doc guardado = documentos.save(fila);

            Map<String, Object> salida = new LinkedHashMap<>();
            salida.put("id", guardado.id.intValue());
            salida.putAll(contenido);
            return ResponseEntity.status(201).body(salida);
        }

        /** UNA lectura. Sin uniones, porque no hay nada que unir. */
        @GetMapping("/tareas/{id}")
        public ResponseEntity<Map<String, Object>> leer(@PathVariable("id") Long id) {
            Doc fila = documentos.findById(id).orElse(null);
            if (fila == null) {
                return ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"));
            }
            Map<String, Object> salida = new LinkedHashMap<>();
            salida.put("id", id.intValue());
            salida.putAll(leerJson(fila.documento));
            return ResponseEntity.ok(salida);
        }

        /** Siempre una: leer un documento no puede costar mas. */
        @GetMapping("/consultas")
        public Map<String, Object> consultas() {
            return Map.of("consultas", 1);
        }

        /**
         * Dos columnas, y ninguna se llama «titulo».
         *
         * `campos_declarados` es cero a proposito: la base no sabe que campos
         * tiene una tarea. Eso no significa que no haya esquema — significa que
         * EL ESQUEMA ESTA EN EL CODIGO y que nadie lo hace cumplir.
         */
        @GetMapping("/esquema")
        public Map<String, Object> esquema() {
            List<String> columnas = jdbc.queryForList(
                    "SELECT LOWER(column_name) FROM information_schema.columns "
                            + "WHERE LOWER(table_name) = 'documentos' ORDER BY 1",
                    String.class);
            return Map.of("columnas", columnas, "campos_declarados", 0);
        }

        /**
         * BUSCAR DENTRO DEL DOCUMENTO — Y AQUI ESTA LA DIFERENCIA.
         *
         * SQLite tiene `json_each` y PostgreSQL tiene operadores de `jsonb`. H2
         * no tiene nada equivalente, asi que no queda mas remedio que traerse
         * TODOS los documentos y filtrarlos en memoria.
         *
         * Es exactamente el problema de la clase 060, y aqui no es un descuido:
         * es lo que pasa cuando el motor no sabe mirar dentro. La eleccion de
         * base de datos decide si esta consulta escala o no.
         */
        @GetMapping("/por-etiqueta")
        public Map<String, Object> porEtiqueta(
                @RequestParam(name = "nombre", defaultValue = "") String nombre) {
            List<Integer> ids = new ArrayList<>();
            for (Doc fila : documentos.findAll()) {
                Object etiquetas = leerJson(fila.documento).get("etiquetas");
                if (etiquetas instanceof List<?> lista && lista.contains(nombre)) {
                    ids.add(fila.id.intValue());
                }
            }
            ids.sort(Integer::compareTo);
            return Map.of("ids", ids, "total", ids.size());
        }

        /**
         * EL COSTE DE INCRUSTAR.
         *
         * El autor esta dentro de cada tarea. Es lo que hace que leer una tarea
         * sea una sola operacion — y tambien lo que obliga a tocar TODOS los
         * documentos para cambiarle el nombre.
         *
         * En el modelo relacional seria un `UPDATE autores SET nombre = ...`
         * sobre una fila. Aqui no hay una fila: hay tantas copias como
         * documentos.
         */
        @PostMapping("/renombrar-autor")
        @SuppressWarnings("unchecked")
        public Map<String, Object> renombrarAutor(
                @RequestBody(required = false) Map<String, Object> cuerpo) {
            Map<String, Object> datos = cuerpo == null ? Map.of() : cuerpo;
            String correo = String.valueOf(datos.getOrDefault("correo", ""));
            String nombre = String.valueOf(datos.getOrDefault("nombre", ""));

            int tocados = 0;
            for (Doc fila : documentos.findAll()) {
                Map<String, Object> contenido = leerJson(fila.documento);
                Object autor = contenido.get("autor");
                if (!(autor instanceof Map<?, ?> mapa)
                        || !correo.equals(mapa.get("correo"))) {
                    continue;
                }
                Map<String, Object> nuevo = new LinkedHashMap<>((Map<String, Object>) mapa);
                nuevo.put("nombre", nombre);
                contenido.put("autor", nuevo);
                fila.documento = escribirJson(contenido);
                documentos.save(fila);
                tocados++;
            }
            return Map.of("documentos_tocados", tocados);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
