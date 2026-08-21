/**
 * EL DOMINIO. Este archivo no importa TypeORM.
 *
 * Es la prueba de que Data Mapper no es un detalle de configuración: la clase de
 * abajo no hereda de nada, no conoce ninguna tabla y no sabe guardarse. Se puede
 * instanciar, probar y razonar sin que exista una base de datos.
 */

export class TituloRequerido extends Error {
  constructor() {
    super("TITULO_REQUERIDO");
    this.codigo = "TITULO_REQUERIDO";
  }
}

export class Tarea {
  /**
   * EL CONSTRUCTOR NO VALIDA, Y NO ES UN DESCUIDO.
   *
   * Al leer una fila, el mapeador construye el objeto y DESPUÉS le pone los
   * campos. Si el constructor exigiera un título, esa construcción vacía
   * fallaría y no se podría leer nada.
   *
   * Es la misma exigencia que hacen Hibernate y EF Core al pedir un constructor
   * sin argumentos, y la razón de que las reglas vayan en una fábrica.
   */
  constructor() {
    this.titulo = "";
    this.hecha = false;
  }

  /** La fábrica: aquí sí se valida, porque aquí nace una tarea de verdad. */
  static crear(titulo) {
    const tarea = new Tarea();
    tarea.renombrar(titulo);
    return tarea;
  }

  marcar(hecha) {
    this.hecha = Boolean(hecha);
  }

  renombrar(titulo) {
    if (!String(titulo ?? "").trim()) throw new TituloRequerido();
    this.titulo = String(titulo);
  }

  salida() {
    return { id: this.id, titulo: this.titulo, hecha: this.hecha };
  }
}
