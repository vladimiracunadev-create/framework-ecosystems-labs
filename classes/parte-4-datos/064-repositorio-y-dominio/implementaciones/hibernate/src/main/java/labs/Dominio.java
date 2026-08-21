package labs;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * EL DOMINIO.
 *
 * Este archivo no importa Hibernate, ni JPA, ni Spring. Es Java corriente, y por
 * eso las reglas de mas abajo se pueden ejecutar en una prueba en milisegundos —
 * sin servidor, sin esquema y sin limpiar tablas entre casos.
 *
 * La ruta `/dominio` lo lee y comprueba, SOBRE SUS IMPORTS, que esa afirmacion
 * es cierta. Prometerlo en un README no cuesta nada; comprobarlo, si.
 */
public final class Dominio {

    private Dominio() {
    }

    public static class ReglaRota extends RuntimeException {
        public final String codigo;

        public ReglaRota(String codigo) {
            super(codigo);
            this.codigo = codigo;
        }
    }

    public static final class Tarea {
        public final long id;
        public String titulo;
        public boolean hecha;

        public Tarea(long id, String titulo, boolean hecha) {
            this.id = id;
            this.titulo = titulo;
            this.hecha = hecha;
        }

        public void terminar() {
            this.hecha = true;
        }
    }

    /**
     * El proyecto es la RAIZ: nadie toca una tarea sin pasar por el.
     *
     * Esa es la razon de que las tres reglas puedan vivir aqui. Si el resto del
     * codigo pudiera anadir tareas por su cuenta, «no se anaden tareas a un
     * proyecto cerrado» seria una recomendacion en lugar de una regla.
     */
    public static final class Proyecto {
        public final long id;
        public String nombre;
        public boolean cerrado;
        public final List<Tarea> tareas;

        public Proyecto(long id, String nombre, boolean cerrado, List<Tarea> tareas) {
            this.id = id;
            this.nombre = nombre;
            this.cerrado = cerrado;
            this.tareas = new ArrayList<>(tareas);
        }

        public Proyecto(long id, String nombre) {
            this(id, nombre, false, List.of());
        }

        /** REGLA 2 y REGLA 3. */
        public Tarea anadirTarea(long idTarea, String titulo) {
            if (cerrado) {
                throw new ReglaRota("PROYECTO_CERRADO");
            }
            if (tareas.stream().anyMatch(t -> t.titulo.equals(titulo))) {
                throw new ReglaRota("TITULO_REPETIDO");
            }
            Tarea tarea = new Tarea(idTarea, titulo, false);
            tareas.add(tarea);
            return tarea;
        }

        /** REGLA 1. */
        public void cerrar() {
            if (pendientes() > 0) {
                throw new ReglaRota("QUEDAN_PENDIENTES");
            }
            cerrado = true;
        }

        public Tarea terminarTarea(long idTarea) {
            for (Tarea tarea : tareas) {
                if (tarea.id == idTarea) {
                    tarea.terminar();
                    return tarea;
                }
            }
            throw new ReglaRota("NO_EXISTE");
        }

        public int pendientes() {
            return (int) tareas.stream().filter(t -> !t.hecha).count();
        }

        public Map<String, Object> salida() {
            return Map.of(
                    "id", (int) id,
                    "nombre", nombre,
                    "cerrado", cerrado,
                    "tareas", tareas.size(),
                    "pendientes", pendientes());
        }
    }

    /** Lo unico que el dominio necesita. Cuatro metodos, y ninguno menciona SQL. */
    public interface Repositorio {
        Proyecto porId(long id);

        Proyecto guardar(Proyecto proyecto);

        long siguienteIdProyecto();

        long siguienteIdTarea();
    }

    /** Para las pruebas. Un mapa y dos contadores. */
    public static final class RepositorioEnMemoria implements Repositorio {
        private final Map<Long, Proyecto> proyectos = new HashMap<>();
        private long siguienteProyecto = 1;
        private long siguienteTarea = 1;

        @Override
        public Proyecto porId(long id) {
            return proyectos.get(id);
        }

        @Override
        public Proyecto guardar(Proyecto proyecto) {
            proyectos.put(proyecto.id, proyecto);
            return proyecto;
        }

        @Override
        public long siguienteIdProyecto() {
            return siguienteProyecto++;
        }

        @Override
        public long siguienteIdTarea() {
            return siguienteTarea++;
        }
    }
}
