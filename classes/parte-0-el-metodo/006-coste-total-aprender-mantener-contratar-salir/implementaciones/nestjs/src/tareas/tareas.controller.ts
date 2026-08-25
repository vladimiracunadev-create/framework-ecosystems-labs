import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";

import { CrearTareaDto } from "./crear-tarea.dto";
import { TareasService } from "./tareas.service";

/**
 * EL CONTROLADOR. Solo encamina.
 *
 * No valida —lo hace el tipo del parámetro— y no guarda —lo hace el servicio—.
 * Es la separación que NestJS impone, y el motivo de que el mismo servicio que
 * en Express cabía en un archivo aquí ocupe cinco.
 */
@Controller("tareas")
export class TareasController {
  // La dependencia entra por el CONSTRUCTOR: el controlador no la construye ni
  // la busca. Es la clase 036 aplicada aquí.
  constructor(private readonly tareas: TareasService) {}

  @Post()
  @HttpCode(201)
  crear(@Body() cuerpo: CrearTareaDto) {
    return this.tareas.crear(cuerpo.titulo);
  }

  @Get()
  listar() {
    return this.tareas.listar();
  }
}
