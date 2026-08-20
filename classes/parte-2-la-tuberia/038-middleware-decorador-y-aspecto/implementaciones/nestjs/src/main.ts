import "reflect-metadata";
import {
  CallHandler, Controller, ExecutionContext, Get, Injectable, MiddlewareConsumer,
  Module, NestInterceptor, NestMiddleware, NestModule, UseInterceptors,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Observable, tap } from "rxjs";
import type { NextFunction, Request, Response } from "express";

const auditoria: string[] = [];

/**
 * (1) EXTERNA — en NestJS se llama MIDDLEWARE. Ve la petición cruda: método,
 * ruta, cabeceras. NO sabe qué controlador ni qué método van a ejecutarse,
 * porque el enrutado todavía no ha ocurrido.
 */
@Injectable()
class CapaExterna implements NestMiddleware {
  use(peticion: Request, respuesta: Response, siguiente: NextFunction): void {
    // `originalUrl` y no `path`: al montar la capa sobre una ruta concreta
    // (`forRoutes("accion")`), Express recorta el prefijo de montaje y `path`
    // vale "/". Es el mismo comportamiento que hace que un enrutador anidado
    // vea rutas relativas — cómodo al componer, sorprendente al registrar.
    auditoria.push(`externa:${peticion.method} ${peticion.originalUrl}`);
    siguiente();
  }
}

/**
 * (2) INTERNA — en NestJS se llama INTERCEPTOR. Ya sabe qué clase y qué método
 * van a ejecutarse, y puede transformar el resultado.
 */
@Injectable()
class CapaInterna implements NestInterceptor {
  intercept(contexto: ExecutionContext, siguiente: CallHandler): Observable<unknown> {
    auditoria.push(`interna:${contexto.getHandler().name}`);
    return siguiente.handle().pipe(tap(() => auditoria.push("interna:fin")));
  }
}

@Controller()
class Controlador {
  @Get("/accion")
  @UseInterceptors(CapaInterna)
  accion() {
    auditoria.push("manejador");
    return { ok: true };
  }

  @Get("/auditoria")
  ver() {
    return { auditoria };
  }
}

@Module({ controllers: [Controlador], providers: [CapaInterna] })
class Aplicacion implements NestModule {
  configure(consumidor: MiddlewareConsumer): void {
    consumidor.apply(CapaExterna).forRoutes("accion");
  }
}

async function arrancar(): Promise<void> {
  const aplicacion = await NestFactory.create(Aplicacion, { logger: false });
  await aplicacion.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
}

void arrancar();
