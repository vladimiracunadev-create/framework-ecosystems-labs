import { Injectable } from "@nestjs/common";

export interface Tarea {
  id: number;
  titulo: string;
}

/**
 * EL SERVICIO. La lista y nada más.
 *
 * En Express esto era una constante `const tareas = []` en el mismo archivo del
 * manejador. Aquí es una clase con `@Injectable()` que el contenedor construye y
 * entrega a quien la pida.
 *
 * Para un servicio de dos rutas es ceremonia. Para uno de doscientas es la
 * diferencia entre saber quién depende de qué y no saberlo.
 */
@Injectable()
export class TareasService {
  private readonly tareas: Tarea[] = [];

  crear(titulo: string): Tarea {
    const tarea = { id: this.tareas.length + 1, titulo };
    this.tareas.push(tarea);
    return tarea;
  }

  listar(): { total: number; tareas: Tarea[] } {
    return { total: this.tareas.length, tareas: this.tareas };
  }
}
