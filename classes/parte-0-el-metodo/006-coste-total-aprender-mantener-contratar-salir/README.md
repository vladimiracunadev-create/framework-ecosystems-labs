# Clase 006 — Coste total: aprender, mantener, contratar, salir

> [⬅️ 005](../005-idiomatico-frente-a-traducido/README.md) · [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [007 ➡️](../007-como-se-mide-y-como-se-miente-el-rendimiento/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> ✅ **Clase construida** — 2 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Poner **número** a lo que cuesta un framework más allá del código que se escribe
el primer día.

Cuatro dimensiones: **aprenderlo**, **mantenerlo**, **contratar a quien lo sepa**
y **salir de él**. Tres se pueden medir desde el propio proyecto. La cuarta no, y
esta clase se niega a inventársela.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Medir** las tres dimensiones medibles sobre cualquier proyecto tuyo, con
  comandos que caben en una línea.
- **Distinguir** dependencias directas de paquetes transitivos, y saber cuál de
  las dos cifras te va a doler.
- **Estimar el coste de salida** contando cuántos archivos tuyos mencionan al
  framework.
- **Reconocer** cuándo un número está inventado, incluso cuando viene con
  decimales.

## 🧩 La situación

Dos frameworks del mismo nicho —Express y NestJS, los dos de Node, los dos
`backend`— resuelven el mismo servicio de dos rutas.

El resultado es **idéntico**: mismos códigos de estado, mismos cuerpos, mismo
comportamiento ante una entrada inválida. Los cuatro primeros casos del contrato
están ahí para demostrarlo.

Y ahí acaba lo que se puede comparar mirando la salida. Todo lo demás —lo que se
tarda en entenderlo, lo que se descarga, lo que cuesta cambiarlo— no aparece en
ninguna respuesta HTTP. Esta clase lo saca a una ruta.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1-2 | `POST /tareas` y `GET /tareas` | que el servicio es el mismo en las dos |
| 3-4 | `POST /tareas` con título vacío | que también fallan igual |
| 5 | `GET /coste` | las cuatro dimensiones, ninguna de adorno |
| 6 | `GET /coste/aprender` | `medido: true` |
| 7 | `GET /coste/mantener` | `medido: true` |
| 8 | `GET /coste/contratar` | **`medido: false`** |
| 9 | `GET /coste/salir` | `medido: true` |

El caso 8 es el que hace honesta a la clase. **El contrato exige que la
implementación declare que no puede medir esa dimensión**, en lugar de devolver
un número plausible.

Un número inventado con formato de número medido es peor que un hueco: el hueco
se ve, y el número no.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Coste total**](../../../glosario/README.md#coste-total) | Lo que cuesta un framework más allá del código: aprenderlo, mantenerlo actualizado, encontrar a quien lo conozca y salir de él. Las cuatro dimensiones se deciden juntas y solo la primera es visible el primer día. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **NestJS** | framework de aplicación de Node.js/TypeScript (TypeScript) | 2017 | MIT | proyecto independiente |

### 🔧 Express

Definió el modelo de middleware encadenado que copiaron casi todos los frameworks de Node.js. Minimalista no significa biblioteca: posee el bucle de peticiones.

- **Documentación oficial:** <https://expressjs.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `express ^5.1.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

### 🔧 NestJS

Trae a Node.js el modelo de Angular y Spring: módulos, decoradores e inyección de dependencias por constructor.

- **Documentación oficial:** <https://docs.nestjs.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@nestjs/common ^11.1.6, @nestjs/core ^11.1.6, @nestjs/platform-express ^11.1.6, class-transformer ^0.5.1, class-validator ^0.14.2, reflect-metadata ^0.2.2, rxjs ^7.8.2, typescript ^5.9.3, @types/node ^24.7.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec tsc -p tsconfig.json
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node dist/main.js
```

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las dos calculan sus cifras **cada vez que alguien pregunta**, leyendo sus
propios archivos. No hay ningún número escrito a mano en ninguna de las dos.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) y [`express/coste.mjs`](implementaciones/express/coste.mjs)

**El servicio entero:**

```javascript
app.post("/tareas", (peticion, respuesta) => {
  const titulo = peticion.body?.titulo;
  if (typeof titulo !== "string" || titulo.trim().length === 0) {
    respuesta.status(422).json({ code: "TITULO_INVALIDO" });
    return;
  }
  const tarea = { id: tareas.length + 1, titulo: titulo.trim() };
  tareas.push(tarea);
  respuesta.status(201).json(tarea);
});
```

Diez líneas. La lista es una constante, la validación es un `if` y el manejador
hace las tres cosas: comprobar, guardar y responder.

**Y el archivo que mide, que es el que más dice:**

```javascript
/**
 * LAS MEDIDAS.
 *
 * Fíjate en lo que NO hay en este archivo: ni un `import express`. Es código
 * JavaScript corriente, y por eso se podría llevar a otro framework tal cual.
 *
 * Esa es exactamente la medida de la dimensión «salir»: cuántos archivos tuyos
 * mencionan al framework y cuántos no.
 */
```

**Mantener** se cuenta en el archivo de bloqueo, no en `package.json`:

```javascript
function paquetesTransitivos() {
  const bloqueo = readFileSync(path.join(RAIZ, "pnpm-lock.yaml"), "utf8");
  const desde = bloqueo.indexOf("\npackages:");
  if (desde === -1) return 0;
  return bloqueo
    .slice(desde)
    .split(/\r?\n/)
    .filter((linea) => /^ {2}\S.*:$/.test(linea)).length;
}
```

Una dependencia directa. **Noventa y cinco paquetes debajo.** Esa segunda cifra
es la que aparece en los avisos de seguridad y la que hay que actualizar.

**Salir** se cuenta buscando el nombre del framework en tus propios archivos:

```javascript
function archivosQueMencionanAlFramework() {
  return archivosDeCodigo().filter((ruta) => /["']express["']/.test(readFileSync(ruta, "utf8")))
    .length;
}
```

Uno de dos. **La mitad de este proyecto se podría mover a otro framework tal
cual.**

**Y la dimensión que no se mide:**

```javascript
  contratar: () => ({
    medido: false,
    por_que: "cuánta gente sabe esto y cuánto cobra no está en ningún archivo del repositorio",
    donde_se_mira: "encuestas públicas del sector y ofertas de tu mercado local, con su fecha",
    aviso: "inventarse este número es peor que no tenerlo",
  }),
```

### NestJS · [`nestjs/src/`](implementaciones/nestjs/src) — el mismo servicio en siete archivos

**El módulo raíz, que en Express no tiene equivalente:**

```typescript
@Module({
  controllers: [TareasController, CosteController],
  providers: [TareasService, CosteService],
})
export class AppModule {}
```

```typescript
 * Este archivo no hace nada en tiempo de ejecución salvo declarar qué existe. En
 * Express no hay equivalente: importar el archivo ya lo registra.
```

**El controlador, que ya no valida ni guarda:**

```typescript
@Controller("tareas")
export class TareasController {
```

```typescript
  @Post()
  @HttpCode(201)
  crear(@Body() cuerpo: CrearTareaDto) {
    return this.tareas.crear(cuerpo.titulo);
  }
```

Tres líneas contra las diez de Express — porque el trabajo se ha ido a otros dos
archivos.

**El servicio:**

```typescript
@Injectable()
export class TareasService {
  private readonly tareas: Tarea[] = [];
```

**Y el objeto de transferencia, que es la validación:**

```typescript
export class CrearTareaDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  titulo!: string;
}
```

```typescript
 * Se paga con dos dependencias más —`class-validator` y `class-transformer`— y
 * con dos conceptos más que aprender. Se cobra en que la regla está declarada
 * una vez y la aplica el framework en todas las rutas que reciban este tipo.
```

**El arranque, con la configuración que Express no necesita:**

```typescript
  aplicacion.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 422,
      exceptionFactory: () => new UnprocessableEntityException({ code: "TITULO_INVALIDO" }),
    }),
  );
```

```typescript
 * `errorHttpStatusCode` está aquí porque NestJS responde 400 por omisión y el
 * contrato pide 422. `exceptionFactory` está aquí porque el cuerpo por omisión
 * es el suyo y el contrato pide el nuestro. Las dos son el mismo tipo de trabajo:
 * doblar lo que el framework decidió por ti.
```

**Los conceptos declarados, tres veces más que en Express:**

```typescript
  private readonly conceptos = [
    "manejador",
    "middleware",
    "enrutado",
    "módulo",
    "proveedor",
    "inyección por constructor",
    "decorador",
    "objeto de transferencia",
    "tubería de validación",
  ];
```

Los tres primeros son los mismos de Express, y no por casualidad: **NestJS corre
sobre Express por debajo**. No los sustituye — los añade.

## 🔬 Comparación

Los números salen de ejecutar las dos implementaciones. Reprodúcelos tú:

```bash
node scripts/run-class.mjs 006
```

| Dimensión | Qué se cuenta | Express | NestJS |
| --- | --- | ---: | ---: |
| **Aprender** | conceptos para leerlo | 3 | **9** |
| | archivos | 2 | **7** |
| | líneas de código | 100 | 186 |
| **Mantener** | dependencias directas | 1 | 7 |
| | paquetes transitivos | 95 | **158** |
| **Contratar** | — | *no medible* | *no medible* |
| **Salir** | archivos que mencionan al framework | **1 de 2** | **6 de 7** |

Y una quinta cifra que esta clase no puede medir pero la
[clase 004](../004-taxonomia-que-compite-de-verdad-con-que/README.md) sí, porque
sale del catálogo:

| | Alternativas reales en su ecosistema |
| --- | ---: |
| Express | 3 — Fastify, hapi, Koa |
| NestJS | **0** |

Léelo junto: NestJS es el más caro de salir **por dos vías a la vez**. Seis de
siete archivos lo mencionan, y no hay ningún framework de su categoría en Node al
que mudarse. Salir no es cambiar una dependencia: es reescribir el proyecto en
otro modelo.

**Esto no dice que NestJS sea peor.** Dice qué se paga. Lo que se cobra —
estructura impuesta, límites explícitos, validación que ninguna ruta puede
saltarse — es real y en un equipo de quince personas puede valer mucho más que
las cifras de la tabla.

Lo que no es defendible es elegirlo **sin conocer estos números**, porque son
fáciles de calcular y muy caros de descubrir tarde.

## ⚠️ Errores frecuentes

- **Mirar solo las dependencias directas.** «Solo tiene siete» y debajo hay
  ciento cincuenta y ocho. Las de abajo son las que salen en los avisos de
  seguridad.
- **Contar líneas como si fuera la medida.** NestJS tiene el doble de líneas y el
  controlador más corto. La cifra que importa en «aprender» es la de conceptos.
- **Olvidar el coste de salida hasta que hay que salir.** Se mide en dos minutos
  el primer día y no se puede pagar el último.
- **Inventar el coste de contratar.** Es la dimensión con más opiniones y menos
  datos. Si lo estimas, di de dónde sale y con qué fecha.
- **Confundir «cuesta más» con «es peor».** La tabla no ordena: informa. Un coste
  alto puede ser una compra excelente si lo que se cobra vale más.

## ✅ Verificación

```bash
node scripts/run-class.mjs 006
```

Para ver los números de una implementación con el servidor levantado:

```bash
curl -s http://127.0.0.1:4100/coste/mantener
```

Y sobre un proyecto tuyo, sin instalar nada:

```bash
grep -c "^  [^ ].*:$" pnpm-lock.yaml
```

## 🧪 Reto de transferencia

1. **Mide tu proyecto actual** en las tres dimensiones medibles. El coste de
   salida —cuántos archivos mencionan al framework sobre el total— suele ser el
   número que más sorprende.
2. **Escribe tu propia lista de conceptos.** Los que hacen falta para que alguien
   nuevo lea un archivo cualquiera de tu código. Si pasa de diez, ya sabes por
   qué la incorporación tarda.
3. **Busca el dato de contratar** en una encuesta pública del sector, con su
   fecha y su tamaño de muestra. Comparar esa cifra con la impresión que tenías
   es la mitad del ejercicio.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué se cobra a cambio de cada coste
- [Clase 004](../004-taxonomia-que-compite-de-verdad-con-que/README.md) — de dónde sale la cifra de alternativas reales
- [Clase 036](../../parte-2-la-tuberia/036-inyeccion-de-dependencias/README.md) — la inyección por constructor que NestJS impone
- [Índice de la parte 0](../README.md)

## Fuentes

- [@richards-ford-fundamentals] Richards, M.; Ford, N. *Fundamentals of Software Architecture: An Engineering Approach*. O'Reilly Media, 2020. ISBN 9781492043454 — <https://openlibrary.org/isbn/9781492043454>
- [@ford-evolutionary-architectures] Ford, N.; Parsons, R.; Kua, P.; Sadalage, P. *Building Evolutionary Architectures*, 2.ª ed. O'Reilly Media, 2022. ISBN 9781492097549 — <https://openlibrary.org/isbn/9781492097549>
- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*, 2.ª ed. Yaknyam Press, 2021. ISBN 9781732102217 — <https://openlibrary.org/isbn/9781732102217>
- [@brooks-mythical-man-month] Brooks, Frederick P. *The Mythical Man-Month*, ed. aniversario. Addison-Wesley, 1995. ISBN 9780201835953 — <https://openlibrary.org/isbn/9780201835953>
