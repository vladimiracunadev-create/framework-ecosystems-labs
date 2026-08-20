import "reflect-metadata";
import { Controller, Get, Injectable, Module, Scope } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

let creadosUnico = 0;
let creadosPorPeticion = 0;

// ÚNICA INSTANCIA (el valor por omisión): se construye una vez al arrancar y
// se comparte. Barato, y cualquier estado que guarde lo ven todas las
// peticiones — incluidas las de otros usuarios.
@Injectable()
class ServicioUnico {
  readonly id = ++creadosUnico;
}

// POR PETICIÓN: una instancia nueva por cada petición. Más caro, y permite
// guardar datos del usuario actual sin riesgo de filtrarlos a otro.
@Injectable({ scope: Scope.REQUEST })
class ServicioPorPeticion {
  readonly id = ++creadosPorPeticion;
}

@Controller()
class Controlador {
  constructor(
    private readonly unico: ServicioUnico,
    private readonly porPeticion: ServicioPorPeticion,
  ) {}

  @Get("/ambitos")
  ambitos() {
    return { unico: this.unico.id, porPeticion: this.porPeticion.id };
  }
}

@Module({ controllers: [Controlador], providers: [ServicioUnico, ServicioPorPeticion] })
class Aplicacion {}

async function arrancar(): Promise<void> {
  const aplicacion = await NestFactory.create(Aplicacion, { logger: false });
  await aplicacion.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
}

void arrancar();
