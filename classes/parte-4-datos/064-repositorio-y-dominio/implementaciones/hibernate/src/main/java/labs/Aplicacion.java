package labs;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import labs.Dominio.Proyecto;
import labs.Dominio.ReglaRota;
import labs.Dominio.Repositorio;
import labs.Dominio.RepositorioEnMemoria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableJpaRepositories(considerNestedRepositories = true)
public class Aplicacion {

    /**
     * EL MODELO DE PERSISTENCIA, distinto del de dominio.
     *
     * Se parece a `Dominio.Proyecto` porque este caso es sencillo, y no tiene por
     * que parecerse: es el repositorio quien traduce entre los dos.
     */
    @Entity
    @Table(name = "proyectos")
    public static class FilaProyecto {
        @Id
        public Long id;

        @Column(nullable = false)
        public String nombre = "";

        @Column(nullable = false)
        public boolean cerrado;

        @OneToMany(mappedBy = "proyecto", cascade = CascadeType.ALL,
                orphanRemoval = true, fetch = FetchType.EAGER)
        public List<FilaTarea> tareas = new ArrayList<>();
    }

    @Entity
    @Table(name = "tareas")
    public static class FilaTarea {
        @Id
        public Long id;

        @Column(nullable = false)
        public String titulo = "";

        @Column(nullable = false)
        public boolean hecha;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "proyecto_id")
        public FilaProyecto proyecto;
    }

    public interface Proyectos extends JpaRepository<FilaProyecto, Long> {
    }

    public interface Tareas extends JpaRepository<FilaTarea, Long> {
    }

    /** Para el servicio. Traduce entre las filas y las entidades del dominio. */
    @Service
    public static class RepositorioJpa implements Repositorio {

        private final Proyectos proyectos;
        private final Tareas tareas;

        public RepositorioJpa(Proyectos proyectos, Tareas tareas) {
            this.proyectos = proyectos;
            this.tareas = tareas;
        }

        /**
         * Devuelve una ENTIDAD DEL DOMINIO, no una fila.
         *
         * Es la linea que separa un repositorio de verdad de uno decorativo: si
         * devolviera la fila, el dominio dependeria de JPA igual que antes y no
         * habria ganado nada.
         */
        @Override
        @Transactional(readOnly = true)
        public Proyecto porId(long id) {
            FilaProyecto fila = proyectos.findById(id).orElse(null);
            if (fila == null) {
                return null;
            }
            List<Dominio.Tarea> lista = fila.tareas.stream()
                    .sorted((a, b) -> Long.compare(a.id, b.id))
                    .map(t -> new Dominio.Tarea(t.id, t.titulo, t.hecha))
                    .toList();
            return new Proyecto(fila.id, fila.nombre, fila.cerrado, lista);
        }

        @Override
        @Transactional
        public Proyecto guardar(Proyecto proyecto) {
            FilaProyecto fila = proyectos.findById(proyecto.id).orElseGet(FilaProyecto::new);
            fila.id = proyecto.id;
            fila.nombre = proyecto.nombre;
            fila.cerrado = proyecto.cerrado;

            Map<Long, FilaTarea> existentes = new HashMap<>();
            for (FilaTarea t : fila.tareas) {
                existentes.put(t.id, t);
            }
            for (Dominio.Tarea tarea : proyecto.tareas) {
                FilaTarea destino = existentes.get(tarea.id);
                if (destino == null) {
                    destino = new FilaTarea();
                    destino.id = tarea.id;
                    destino.proyecto = fila;
                    fila.tareas.add(destino);
                }
                destino.titulo = tarea.titulo;
                destino.hecha = tarea.hecha;
            }
            proyectos.save(fila);
            return proyecto;
        }

        @Override
        public long siguienteIdProyecto() {
            return proyectos.findAll().stream().mapToLong(p -> p.id).max().orElse(0L) + 1;
        }

        @Override
        public long siguienteIdTarea() {
            return tareas.findAll().stream().mapToLong(t -> t.id).max().orElse(0L) + 1;
        }
    }

    @RestController
    public static class Controlador {

        private final Repositorio repositorio;

        public Controlador(RepositorioJpa repositorio) {
            this.repositorio = repositorio;
        }

        private static ResponseEntity<Map<String, Object>> responder(ReglaRota fallo) {
            int estado = "NO_EXISTE".equals(fallo.codigo) ? 404 : 409;
            return ResponseEntity.status(estado).body(Map.of("code", fallo.codigo));
        }

        /**
         * LA COMPROBACION QUE HACE HONESTA A ESTA CLASE.
         *
         * Se lee el archivo del dominio y se miran sus IMPORTS. No cualquier
         * mencion: el propio comentario de ese archivo dice «no importa
         * Hibernate», y buscar la palabra suelta daria un falso positivo. Lo que
         * importa es DE QUE DEPENDE el modulo, no de que habla.
         */
        @GetMapping("/dominio")
        public Map<String, Object> dominio() throws Exception {
            String texto;
            try (InputStream entrada = getClass().getResourceAsStream("/labs/Dominio.java")) {
                texto = new String(entrada.readAllBytes(), StandardCharsets.UTF_8);
            }
            List<String> importados = texto.lines()
                    .filter(linea -> linea.startsWith("import "))
                    .toList();
            List<String> prohibidas = List.of("jakarta", "hibernate", "springframework");
            boolean mencionaOrm = importados.stream().anyMatch(
                    linea -> prohibidas.stream().anyMatch(p -> linea.toLowerCase().contains(p)));
            int reglas = texto.split("REGLA \\d", -1).length - 1;
            return Map.of("menciona_orm", mencionaOrm, "importa", importados, "reglas", reglas);
        }

        @PostMapping("/proyectos")
        public ResponseEntity<Map<String, Object>> crear(
                @RequestBody(required = false) Map<String, Object> cuerpo) {
            Object nombre = cuerpo == null ? null : cuerpo.get("nombre");
            Proyecto proyecto = new Proyecto(repositorio.siguienteIdProyecto(),
                    nombre == null ? "" : nombre.toString());
            repositorio.guardar(proyecto);
            return ResponseEntity.status(201).body(proyecto.salida());
        }

        @PostMapping("/proyectos/{id}/tareas")
        public ResponseEntity<Map<String, Object>> anadirTarea(@PathVariable("id") long id,
                @RequestBody(required = false) Map<String, Object> cuerpo) {
            Proyecto proyecto = repositorio.porId(id);
            if (proyecto == null) {
                return ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"));
            }
            Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
            try {
                // La regla se aplica EN EL DOMINIO. El manejador no sabe cuales
                // son ni en que orden: solo traduce el fallo a un codigo HTTP.
                proyecto.anadirTarea(repositorio.siguienteIdTarea(),
                        titulo == null ? "" : titulo.toString());
            } catch (ReglaRota fallo) {
                return responder(fallo);
            }
            repositorio.guardar(proyecto);
            return ResponseEntity.status(201).body(proyecto.salida());
        }

        @PostMapping("/proyectos/{id}/tareas/{tarea}/terminar")
        public ResponseEntity<Map<String, Object>> terminar(@PathVariable("id") long id,
                @PathVariable("tarea") long idTarea) {
            Proyecto proyecto = repositorio.porId(id);
            if (proyecto == null) {
                return ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"));
            }
            try {
                proyecto.terminarTarea(idTarea);
            } catch (ReglaRota fallo) {
                return responder(fallo);
            }
            repositorio.guardar(proyecto);
            return ResponseEntity.ok(proyecto.salida());
        }

        @PostMapping("/proyectos/{id}/cerrar")
        public ResponseEntity<Map<String, Object>> cerrar(@PathVariable("id") long id) {
            Proyecto proyecto = repositorio.porId(id);
            if (proyecto == null) {
                return ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"));
            }
            try {
                proyecto.cerrar();
            } catch (ReglaRota fallo) {
                return responder(fallo);
            }
            repositorio.guardar(proyecto);
            return ResponseEntity.ok(proyecto.salida());
        }

        @GetMapping("/proyectos/{id}")
        public ResponseEntity<Map<String, Object>> leer(@PathVariable("id") long id) {
            Proyecto proyecto = repositorio.porId(id);
            return proyecto == null
                    ? ResponseEntity.status(404).body(Map.of("code", "NO_EXISTE"))
                    : ResponseEntity.ok(proyecto.salida());
        }

        /**
         * LAS MISMAS TRES REGLAS, CONTRA EL REPOSITORIO EN MEMORIA.
         *
         * Sin base de datos, sin esquema, sin limpiar tablas. Es el argumento
         * entero de esta clase, y aqui se ejecuta de verdad en lugar de
         * afirmarse.
         */
        @GetMapping("/pruebas-del-dominio")
        public Map<String, Object> pruebasDelDominio() {
            RepositorioEnMemoria memoria = new RepositorioEnMemoria();
            List<Map<String, Object>> resultados = new ArrayList<>();

            Proyecto uno = new Proyecto(memoria.siguienteIdProyecto(), "pruebas");
            uno.anadirTarea(memoria.siguienteIdTarea(), "pendiente");
            memoria.guardar(uno);
            resultados.add(comprobar("no se cierra con pendientes",
                    uno::cerrar, "QUEDAN_PENDIENTES"));

            Proyecto dos = new Proyecto(memoria.siguienteIdProyecto(), "cerrado");
            dos.cerrar();
            resultados.add(comprobar("no se anade a uno cerrado",
                    () -> dos.anadirTarea(memoria.siguienteIdTarea(), "tarde"),
                    "PROYECTO_CERRADO"));

            Proyecto tres = new Proyecto(memoria.siguienteIdProyecto(), "repetidos");
            tres.anadirTarea(memoria.siguienteIdTarea(), "misma");
            resultados.add(comprobar("no se repite el titulo",
                    () -> tres.anadirTarea(memoria.siguienteIdTarea(), "misma"),
                    "TITULO_REPETIDO"));

            long pasadas = resultados.stream()
                    .filter(r -> Boolean.TRUE.equals(r.get("paso"))).count();
            return Map.of(
                    "ejecutadas", resultados.size(),
                    "pasadas", (int) pasadas,
                    "uso_base_de_datos", false,
                    "detalle", resultados);
        }

        private static Map<String, Object> comprobar(String nombre, Runnable operacion,
                String esperado) {
            try {
                operacion.run();
                return Map.of("nombre", nombre, "paso", false, "motivo", "no lanzo");
            } catch (ReglaRota fallo) {
                return Map.of("nombre", nombre, "paso", esperado.equals(fallo.codigo),
                        "motivo", fallo.codigo);
            }
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
