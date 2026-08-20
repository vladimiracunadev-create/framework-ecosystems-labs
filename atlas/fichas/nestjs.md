# 🐱 NestJS — 2017

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

NestJS trae a Node.js algo que su ecosistema no tenía: **estructura impuesta**.
Módulos, decoradores, inyección de dependencias por constructor, capas
separadas. Es, deliberadamente, Angular y Spring aplicados al backend de
JavaScript.

> **🎯 Por qué está en este programa**
>
> Porque es **el mismo patrón del [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)
> en un tercer ecosistema**. Quien reconoce el contenedor de Spring y el de
> Angular reconoce este sin aprender nada nuevo, y esa transferencia es
> exactamente lo que el programa persigue.
>
> Y porque es el contrapunto de [Express](express.md) dentro del mismo runtime: la
> comparación aísla la variable «cuánta estructura trae el framework».

| | |
|---|---|
| **Aparición** | 2017, creado por Kamil Myśliwiec |
| **Clasificación** | `application-framework` |
| **Ecosistema** | Node.js / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.nestjs.com/> |

---

## 💡 La estructura, que es la propuesta

```typescript
// El servicio declara qué necesita. No lo construye ni lo busca.
@Injectable()
export class ServicioDeTareas {
  constructor(private readonly repositorio: RepositorioDeTareas) {}

  crear(titulo: string) { /* regla de dominio, sin saber que existe HTTP */ }
}

// El controlador solo traduce entre HTTP y el caso de uso.
@Controller("tasks")
export class ControladorDeTareas {
  constructor(private readonly tareas: ServicioDeTareas) {}

  @Post()
  crear(@Body() cuerpo: CrearTareaDto) {
    return this.tareas.crear(cuerpo.title);
  }
}
```

Las cuatro capas del [módulo 05](../../curriculum/05-backend-y-api.md) —transporte,
aplicación, dominio, infraestructura— aparecen aquí como **estructura del
framework**, no como disciplina del equipo. El controlador traduce; el servicio
decide; el repositorio persiste.

Y el mecanismo de extensión es el catálogo completo del módulo 02: guardias,
interceptores, tuberías y filtros, cada uno con su punto en el ciclo. Reconocer
que son los mismos conceptos que middleware, aspectos y filtros en otros
ecosistemas es la transferencia que el programa quiere producir.

## ⚖️ Express frente a NestJS, con la variable aislada

Mismo runtime, mismo lenguaje, misma persona: solo cambia cuánta estructura trae
el framework.

| | Express | NestJS |
| --- | --- | --- |
| Estructura del proyecto | La decides | Impuesta: módulos, controladores, servicios |
| Inyección de dependencias | No existe | Contenedor completo |
| Validación | Eliges biblioteca | Tuberías integradas |
| Pruebas | Montas el arnés | Utilidades de prueba con el contenedor |
| Curva inicial | Baja | Alta |
| Riesgo característico | Fallar **por omisión** | Ceremonia donde no hacía falta |
| Encaja en | Servicios pequeños, equipos con criterio | Sistemas grandes, equipos que rotan |

Esta tabla es la comparación más limpia que ofrece el ecosistema JavaScript,
porque **todas las demás variables están fijas**. Es lo que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) pide y casi ninguna
comparativa consigue.

## 🧭 Lo que hay que declarar

**1. La ceremonia tiene un mínimo.** Un servicio con tres rutas necesita módulo,
controlador, servicio y objetos de transferencia. En un sistema grande eso es
orden; en uno pequeño es ruido, y admitirlo forma parte de decidir bien.

**2. Usa un servidor por debajo.** NestJS se apoya en Express —o en Fastify— y a
veces hay que bajar a ese nivel. Es una capa más en la pila, con su propia
superficie de errores.

**3. Los decoradores son una función del lenguaje que aún evoluciona.** El modelo
sobre el que se apoya NestJS ha ido cambiando en TypeScript, y eso es una
dimensión de compatibilidad a vigilar.

## 🎯 Cuándo la estructura se paga sola

La respuesta corta: **cuando hay rotación**. Un equipo estable con criterio
compartido no necesita que el framework imponga nada. Un equipo de treinta
personas donde entran y salen cinco al año sí: la estructura ahorra decisiones
repetidas y conversaciones que no aportan.

Ese es el argumento serio a favor de los frameworks con opinión, y aparece igual
en Spring, en Angular y aquí. Es más un argumento organizativo que técnico
[@martin-clean-code], y por eso el módulo 11 lo puntúa como **capacidades del
equipo**, no como calidad del framework.

El vocabulario común ayuda además a que la conversación sea posible: cuando todo
el equipo llama «fábrica», «decorador» o «estrategia» a lo mismo, las revisiones
de código dejan de ser discusiones de estilo [@freeman-head-first-patterns].

## 🎓 Las tres lecciones

**1. El mismo patrón aparece en tres ecosistemas.** Spring, Angular y NestJS
comparten contenedor, inyección por constructor y ciclo de vida. Aprenderlo una
vez sirve tres veces.

**2. La estructura impuesta se amortiza con rotación, no con tamaño.** Un sistema
grande y estable puede vivir sin ella; uno mediano con mucha rotación, no.

**3. Aislar la variable hace comparable lo que normalmente no lo es.** Express
frente a NestJS es una comparación honesta porque todo lo demás está fijo.

## 🔗 Enlaces

- Documentación oficial: <https://docs.nestjs.com/>
- [Ficha de Express](express.md) — la otra columna · [Ficha de Spring Boot](spring-boot.md) · [Ficha de Angular](angular.md)
- [Módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@martin-clean-code] Martin, Robert C. *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall, 2008. ISBN 9780132350884 — <https://openlibrary.org/isbn/9780132350884>
- [@freeman-head-first-patterns] Freeman, Eric; Robson, Elisabeth; Bates, Bert; Sierra, Kathy. *Head First Design Patterns*. O'Reilly, 2004. ISBN 9780596007126 — <https://openlibrary.org/isbn/9780596007126>
