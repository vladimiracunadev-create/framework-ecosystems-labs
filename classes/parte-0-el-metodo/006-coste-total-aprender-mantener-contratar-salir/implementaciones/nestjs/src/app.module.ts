import { Module } from "@nestjs/common";

import { CosteController } from "./coste/coste.controller";
import { CosteService } from "./coste/coste.service";
import { TareasController } from "./tareas/tareas.controller";
import { TareasService } from "./tareas/tareas.service";

/**
 * EL MÓDULO RAÍZ.
 *
 * Este archivo no hace nada en tiempo de ejecución salvo declarar qué existe. En
 * Express no hay equivalente: importar el archivo ya lo registra.
 *
 * Es la pieza que hace posible el resto —el contenedor sabe qué construir— y
 * también un archivo más que mantener y un concepto más que enseñar a quien
 * llega. Las dos cosas son ciertas a la vez, y de eso trata la clase.
 */
@Module({
  controllers: [TareasController, CosteController],
  providers: [TareasService, CosteService],
})
export class AppModule {}
