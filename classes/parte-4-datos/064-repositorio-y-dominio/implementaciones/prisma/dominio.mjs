/**
 * EL DOMINIO.
 *
 * Este archivo no importa Prisma, ni Express, ni nada que sepa de bases de
 * datos. Es JavaScript corriente, y por eso las reglas de más abajo se pueden
 * ejecutar en una prueba en milisegundos — sin servidor, sin esquema y sin
 * limpiar tablas entre casos.
 *
 * La ruta `/dominio` lo lee y comprueba, sobre el texto, que esa afirmación es
 * cierta. Prometerlo en un README no cuesta nada; comprobarlo, sí.
 */

export class ReglaRota extends Error {
  constructor(codigo) {
    super(codigo);
    this.codigo = codigo;
  }
}

export class Tarea {
  constructor(id, titulo, hecha = false) {
    this.id = id;
    this.titulo = titulo;
    this.hecha = hecha;
  }

  terminar() {
    this.hecha = true;
  }
}

/**
 * El proyecto es la RAÍZ: nadie toca una tarea sin pasar por él.
 *
 * Esa es la razón de que las tres reglas puedan vivir aquí. Si el resto del
 * código pudiera añadir tareas por su cuenta, «no se añaden tareas a un proyecto
 * cerrado» sería una recomendación en lugar de una regla.
 */
export class Proyecto {
  constructor(id, nombre, cerrado = false, tareas = []) {
    this.id = id;
    this.nombre = nombre;
    this.cerrado = cerrado;
    this.tareas = tareas;
  }

  /** REGLA 2 y REGLA 3. */
  anadirTarea(id, titulo) {
    if (this.cerrado) throw new ReglaRota("PROYECTO_CERRADO");
    if (this.tareas.some((t) => t.titulo === titulo)) throw new ReglaRota("TITULO_REPETIDO");
    const tarea = new Tarea(id, titulo);
    this.tareas.push(tarea);
    return tarea;
  }

  /** REGLA 1. */
  cerrar() {
    if (this.pendientes() > 0) throw new ReglaRota("QUEDAN_PENDIENTES");
    this.cerrado = true;
  }

  terminarTarea(id) {
    const tarea = this.tareas.find((t) => t.id === id);
    if (!tarea) throw new ReglaRota("NO_EXISTE");
    tarea.terminar();
    return tarea;
  }

  pendientes() {
    return this.tareas.filter((t) => !t.hecha).length;
  }

  salida() {
    return {
      id: this.id,
      nombre: this.nombre,
      cerrado: this.cerrado,
      tareas: this.tareas.length,
      pendientes: this.pendientes(),
    };
  }
}
