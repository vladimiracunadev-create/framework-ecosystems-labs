package labs;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Spring es el unico de los cuatro con una cache DECLARATIVA de serie.
 *
 * `@EnableCaching` la enciende; `@Cacheable` y `@CacheEvict` la usan. No hay
 * ningun mapa a la vista, y esa es a la vez su virtud y su trampa: el codigo no
 * dice donde esta la cache ni cuando se vacia.
 */
@SpringBootApplication
@EnableCaching
public class Aplicacion {

    @Service
    public static class Almacen {

        /**
         * EL ALMACEN. Aqui hace de base de datos, y lo unico que importa de el
         * es que cada lectura CUESTA — por eso se cuentan.
         */
        private final Map<Integer, Map<String, Object>> filas = new HashMap<>();
        private final AtomicInteger consultas = new AtomicInteger();
        private final AtomicInteger aciertos = new AtomicInteger();

        public Almacen() {
            reiniciarDatos();
        }

        public final void reiniciarDatos() {
            filas.clear();
            Map<String, Object> tarea = new HashMap<>();
            tarea.put("id", 1);
            tarea.put("titulo", "comprar pan");
            filas.put(1, tarea);
            consultas.set(0);
            aciertos.set(0);
        }

        public Map<String, Object> metricas() {
            return Map.of("consultas", consultas.get(), "aciertos", aciertos.get());
        }

        public void contarAcierto() {
            aciertos.incrementAndGet();
        }

        /**
         * `@Cacheable` es todo el mecanismo: si la clave esta, devuelve lo
         * guardado SIN ENTRAR AL METODO; si no, entra, y guarda lo que devuelva.
         *
         * De ahi que el contador de consultas viva DENTRO: solo sube cuando el
         * cuerpo se ejecuta de verdad.
         */
        @Cacheable(cacheNames = "tareas", key = "#id")
        public Map<String, Object> leer(int id) {
            consultas.incrementAndGet();
            Map<String, Object> fila = filas.get(id);
            return fila == null ? null : new HashMap<>(fila);
        }

        /** LEER SIN PASAR POR LA CACHE: la verdad, para poder compararla. */
        public Map<String, Object> leerSinCache(int id) {
            consultas.incrementAndGet();
            Map<String, Object> fila = filas.get(id);
            return fila == null ? null : new HashMap<>(fila);
        }

        /**
         * ESCRIBIR E INVALIDAR. `@CacheEvict` BORRA la entrada.
         *
         * Existe tambien `@CachePut`, que escribe el valor nuevo en la cache.
         * Parece mas eficiente y abre una carrera: dos escrituras a la vez
         * pueden dejar guardado el valor de la que perdio. Borrar solo puede
         * causar una consulta de mas.
         */
        @CacheEvict(cacheNames = "tareas", key = "#id")
        public Map<String, Object> modificar(int id, String titulo) {
            Map<String, Object> fila = filas.get(id);
            if (fila == null) {
                return null;
            }
            fila.put("titulo", titulo);
            return new HashMap<>(fila);
        }

        /**
         * ESCRIBIR Y OLVIDAR LA INVALIDACION: el mismo metodo SIN `@CacheEvict`.
         *
         * No falla nada. Simplemente, a partir de aqui, la cache devuelve un
         * valor que ya no existe en ninguna parte.
         *
         * Y fijate en lo facil que es: la diferencia entre lo correcto y lo roto
         * es una anotacion que no esta. Nada en el cuerpo del metodo lo insinua.
         */
        public void escribirSinInvalidar(String titulo) {
            filas.get(1).put("titulo", titulo);
        }
    }

    @RestController
    public static class Controlador {

        private final Almacen almacen;
        private final CacheManager gestor;

        public Controlador(Almacen almacen, CacheManager gestor) {
            this.almacen = almacen;
            this.gestor = gestor;
        }

        @GetMapping("/reiniciar")
        public Map<String, Object> reiniciar() {
            gestor.getCache("tareas").clear();
            almacen.reiniciarDatos();
            return almacen.metricas();
        }

        @GetMapping("/metricas")
        public Map<String, Object> metricas() {
            return almacen.metricas();
        }

        @GetMapping("/tareas/{id}")
        public ResponseEntity<Map<String, Object>> leer(@PathVariable("id") int id) {
            // Para contar los aciertos hay que preguntarle a la cache ANTES:
            // `@Cacheable` no dice si acerto o no. Es la contrapartida de que la
            // cache sea invisible en el codigo.
            boolean estaba = gestor.getCache("tareas").get(id) != null;
            Map<String, Object> tarea = almacen.leer(id);
            if (tarea == null) {
                return ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"));
            }
            if (estaba) {
                almacen.contarAcierto();
            }
            return ResponseEntity.ok()
                    .header("X-Cache", estaba ? "HIT" : "MISS")
                    .body(tarea);
        }

        @GetMapping("/sin-cache/tareas/{id}")
        public ResponseEntity<Map<String, Object>> leerSinCache(@PathVariable("id") int id) {
            Map<String, Object> tarea = almacen.leerSinCache(id);
            return tarea == null
                    ? ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"))
                    : ResponseEntity.ok(tarea);
        }

        @PatchMapping("/tareas/{id}")
        public ResponseEntity<Map<String, Object>> modificar(@PathVariable("id") int id,
                @RequestBody(required = false) Map<String, Object> cuerpo) {
            Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
            Map<String, Object> tarea = almacen.modificar(id, titulo == null ? "" : titulo.toString());
            return tarea == null
                    ? ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"))
                    : ResponseEntity.ok(tarea);
        }

        @PostMapping("/escribir-sin-invalidar")
        public Map<String, Object> sinInvalidar(
                @RequestBody(required = false) Map<String, Object> cuerpo) {
            Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
            almacen.escribirSinInvalidar(titulo == null ? "" : titulo.toString());
            return Map.of("ok", true);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
