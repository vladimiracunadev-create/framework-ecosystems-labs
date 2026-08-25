import { Controller, Get, NotFoundException, Param } from "@nestjs/common";

import { CosteService } from "./coste.service";

@Controller("coste")
export class CosteController {
  constructor(private readonly coste: CosteService) {}

  @Get()
  resumen() {
    const dimensiones = this.coste.dimensiones();
    return {
      framework: "nestjs",
      dimensiones,
      medibles_desde_aqui: dimensiones.filter((d) => this.coste.medir(d)?.medido),
    };
  }

  @Get(":dimension")
  detalle(@Param("dimension") dimension: string) {
    const medida = this.coste.medir(dimension);
    if (!medida) {
      throw new NotFoundException({ code: "DIMENSION_DESCONOCIDA" });
    }
    return { dimension, framework: "nestjs", ...medida };
  }
}
