import "reflect-metadata";
import {
  Body, Controller, HttpCode, HttpException, Module, Post, ValidationPipe,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsOptional, IsString, Length } from "class-validator";

/**
 * En NestJS la declaración es UNA clase con dos familias de decoradores:
 * `class-validator` para la validación y `@ApiProperty` para la documentación.
 *
 * Es una fuente de verdad —la clase— y dos vocabularios sobre ella. Menos
 * elegante que FastAPI, y sigue sin poder divergir: los dos decoradores están
 * en la misma línea del mismo campo.
 */
class CrearTareaDto {
  @ApiProperty({ minLength: 1, maxLength: 120, description: "Qué hay que hacer" })
  @IsString()
  @Length(1, 120)
  titulo!: string;

  @ApiProperty({ enum: [1, 2, 3], default: 2, description: "1 alta, 3 baja" })
  @IsOptional()
  @IsInt()
  @IsIn([1, 2, 3])
  prioridad?: number;
}

@Controller()
class Controlador {
  @Post("/tareas")
  @HttpCode(201)
  crear(@Body() tarea: CrearTareaDto) {
    return { titulo: tarea.titulo, prioridad: tarea.prioridad ?? 2 };
  }
}

@Module({ controllers: [Controlador] })
class Aplicacion {}

async function arrancar(): Promise<void> {
  const aplicacion = await NestFactory.create(Aplicacion, { logger: false });

  aplicacion.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // Tiene que ser una `HttpException`: devolver un `Error` normal aquí
      // hace que NestJS lo trate como fallo no controlado y responda 500.
      exceptionFactory: () => new HttpException({ code: "VALIDACION" }, 422),
    }),
  );

  const configuracion = new DocumentBuilder().setTitle("Clase 042").setVersion("1.0.0").build();
  const documento = SwaggerModule.createDocument(aplicacion, configuracion);
  SwaggerModule.setup("docs", aplicacion, documento, { jsonDocumentUrl: "openapi.json" });

  await aplicacion.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
}

void arrancar();
