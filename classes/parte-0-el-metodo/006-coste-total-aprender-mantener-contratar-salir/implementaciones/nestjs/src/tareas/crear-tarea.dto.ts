import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

/**
 * EL OBJETO DE TRANSFERENCIA.
 *
 * En Express esto no existe: el cuerpo es un objeto y se comprueba a mano. Aquí
 * es una clase con decoradores, y esa clase ES la validación.
 *
 * Se paga con dos dependencias más —`class-validator` y `class-transformer`— y
 * con dos conceptos más que aprender. Se cobra en que la regla está declarada
 * una vez y la aplica el framework en todas las rutas que reciban este tipo.
 */
export class CrearTareaDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  titulo!: string;
}
