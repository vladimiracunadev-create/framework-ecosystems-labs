import "reflect-metadata";
import { Controller, Get, Inject, Injectable, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

/**
 * El contrato: lo que el manejador necesita. No sabe quién lo cumple, y esa
 * ignorancia es exactamente el punto — permite sustituirlo sin tocarlo.
 */
interface Reloj {
  ahora(): string;
}

const RELOJ = "RELOJ";

@Injectable()
class RelojFijo implements Reloj {
  ahora(): string {
    return "2026-01-01T00:00:00Z";
  }
}

@Controller()
class Controlador {
  // La dependencia entra por el CONSTRUCTOR. El controlador no la construye,
  // no la busca y no sabe de qué clase es.
  constructor(@Inject(RELOJ) private readonly reloj: Reloj) {}

  @Get("/ahora")
  ahora() {
    return { ahora: this.reloj.ahora(), origen: "inyectado" };
  }
}

@Module({
  controllers: [Controlador],
  providers: [{ provide: RELOJ, useClass: RelojFijo }],
})
class Aplicacion {}

// Sin `await` de primer nivel: el objetivo de compilación es CommonJS, que no
// lo admite. Es el mismo motivo por el que NestJS genera este arranque dentro
// de una función.
async function arrancar(): Promise<void> {
  const aplicacion = await NestFactory.create(Aplicacion, { logger: false });
  await aplicacion.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
}

void arrancar();
