import "reflect-metadata";
import { UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

/**
 * EL ARRANQUE.
 *
 * Tres líneas de configuración que en Express no existen, y que a cambio hacen
 * que ninguna ruta de la aplicación pueda saltarse la validación.
 *
 * `errorHttpStatusCode` está aquí porque NestJS responde 400 por omisión y el
 * contrato pide 422. `exceptionFactory` está aquí porque el cuerpo por omisión
 * es el suyo y el contrato pide el nuestro. Las dos son el mismo tipo de trabajo:
 * doblar lo que el framework decidió por ti.
 */
async function arrancar(): Promise<void> {
  const aplicacion = await NestFactory.create(AppModule, { logger: false });

  aplicacion.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 422,
      exceptionFactory: () => new UnprocessableEntityException({ code: "TITULO_INVALIDO" }),
    }),
  );

  await aplicacion.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
}

void arrancar();
