import { Proyecto, Tarea } from "./dominio.mjs";

/**
 * DOS IMPLEMENTACIONES DE LA MISMA IDEA.
 *
 * El dominio solo pide tres cosas: dame un proyecto, guárdame un proyecto, dame
 * el siguiente identificador. Cualquier cosa que sepa hacer eso le vale.
 *
 * La de memoria existe para las pruebas. La de Prisma, para el servicio. Y el
 * dominio no distingue una de otra — que es la prueba de que la abstracción
 * está bien puesta.
 */

export class RepositorioEnMemoria {
  constructor() {
    this.proyectos = new Map();
    this.siguiente = 1;
    this.siguienteTarea = 1;
  }

  async porId(id) {
    return this.proyectos.get(id) ?? null;
  }

  async guardar(proyecto) {
    this.proyectos.set(proyecto.id, proyecto);
    return proyecto;
  }

  async siguienteIdProyecto() {
    return this.siguiente++;
  }

  async siguienteIdTarea() {
    return this.siguienteTarea++;
  }
}

export class RepositorioPrisma {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Devuelve una ENTIDAD DEL DOMINIO, no una fila de Prisma.
   *
   * Es la línea que separa un repositorio de verdad de uno decorativo: si
   * devolviera el objeto de Prisma, el dominio dependería de Prisma igual que
   * antes y no habría ganado nada.
   */
  async porId(id) {
    const fila = await this.prisma.proyecto.findUnique({
      where: { id },
      include: { tareas: { orderBy: { id: "asc" } } },
    });
    if (!fila) return null;
    return new Proyecto(
      fila.id,
      fila.nombre,
      fila.cerrado,
      fila.tareas.map((t) => new Tarea(t.id, t.titulo, t.hecha)),
    );
  }

  async guardar(proyecto) {
    await this.prisma.proyecto.upsert({
      where: { id: proyecto.id },
      update: { nombre: proyecto.nombre, cerrado: proyecto.cerrado },
      create: { id: proyecto.id, nombre: proyecto.nombre, cerrado: proyecto.cerrado },
    });
    for (const tarea of proyecto.tareas) {
      await this.prisma.tarea.upsert({
        where: { id: tarea.id },
        update: { titulo: tarea.titulo, hecha: tarea.hecha },
        create: {
          id: tarea.id,
          titulo: tarea.titulo,
          hecha: tarea.hecha,
          proyectoId: proyecto.id,
        },
      });
    }
    return proyecto;
  }

  async siguienteIdProyecto() {
    const [{ siguiente }] = await this.prisma
      .$queryRawUnsafe("SELECT COALESCE(MAX(id), 0) + 1 AS siguiente FROM Proyecto");
    return Number(siguiente);
  }

  async siguienteIdTarea() {
    const [{ siguiente }] = await this.prisma
      .$queryRawUnsafe("SELECT COALESCE(MAX(id), 0) + 1 AS siguiente FROM Tarea");
    return Number(siguiente);
  }
}
