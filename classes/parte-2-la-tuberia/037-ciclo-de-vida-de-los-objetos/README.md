# Clase 037 — Ciclo de vida de los objetos

> [⬅️ 036](../036-inyeccion-de-dependencias/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [038 ➡️](../038-middleware-decorador-y-aspecto/README.md)
>
> Parte **2 — La tubería** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Elegir entre **única instancia**, **una por petición** y **una por uso** sabiendo
qué se gana y qué se arriesga. Es el ajuste que más fallos sutiles causa de toda
la parte 2.

## 🧩 La situación

Dos servicios idénticos con ámbitos distintos exponen un contador de cuántas veces
se construyeron. Tres peticiones seguidas revelan la diferencia: **el de única
instancia sigue en 1**.

## 📖 Los tres ámbitos

| Ámbito | Cuándo se crea | Coste | Riesgo |
| --- | --- | --- | --- |
| **Única instancia** | una vez, al arrancar | mínimo | el estado lo comparten **todas** las peticiones |
| **Por petición** | una por petición | bajo | ninguno relevante |
| **Por uso** | cada vez que se pide | el mayor | ninguno; puede sorprender que haya varias |

Los nombres cambian —*singleton*, *scoped*, *transient*, *request*— y la idea es
la misma en los cuatro frameworks.

## ⚠️ El fallo que esta clase existe para prevenir

Guardar **estado de una petición** en un objeto de **única instancia**.

```java
@Component                       // ¡única instancia!
class Servicio {
    private String usuarioActual;   // ← el usuario de la última petición
}
```

Ese campo lo comparten todas las peticiones. Con dos usuarios simultáneos, **uno
puede ver los datos del otro**.

Y lo peor es cómo se manifiesta: **funciona perfectamente en desarrollo**, donde
hay una petición cada vez. El fallo aparece con concurrencia, es intermitente, y
depende de la coincidencia temporal — la clase de error más cara de diagnosticar.

Es el mismo error que la clase 027 destapó con la traza en una variable de módulo,
con otra cara: aquí el estado global no lo escribes tú, **te lo da el contenedor**
sin que se note.

OWASP lo clasifica entre los fallos de control de acceso, porque su consecuencia
habitual es servirle a alguien los datos de otro [@owasp-top10].

**La regla:** un objeto de única instancia debe ser **sin estado**, o tener solo
estado inmutable, o usar estructuras pensadas para concurrencia.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| 1.ª | `unico: 1` |
| 2.ª | `unico: 1` — **no se volvió a crear** |
| 3.ª | `unico: 1` |

## 🌐 Las implementaciones

### NestJS — el ámbito en el decorador

```typescript
@Injectable()                              // única instancia (por omisión)
class ServicioUnico { ... }

@Injectable({ scope: Scope.REQUEST })      // una por petición
class ServicioPorPeticion { ... }
```

Y un detalle de propagación importante: **un servicio por petición contagia su
ámbito a quien lo inyecta**. El controlador que depende de él pasa a construirse
por petición también, con su coste.

### Spring Boot — el proxy que resuelve la paradoja

```java
@Component
@RequestScope
static class ServicioPorPeticion { ... }
```

Aquí hay un problema que salta a la vista al pensarlo: **el controlador es de
única instancia y necesita algo por petición**. ¿Cómo puede un objeto que se creó
al arrancar recibir uno que se crea después?

La respuesta es un **proxy**: Spring inyecta un intermediario —que sí es único— y
ese intermediario resuelve, en cada llamada, la instancia real de la petición en
curso.

Sin ese mecanismo, un objeto de vida larga no podría depender de uno de vida
corta. Y explica un fallo clásico: inyectar un objeto por petición **sin** proxy
congela la primera instancia para siempre.

### ASP.NET Core — tres ámbitos con nombre

```csharp
constructor.Services.AddSingleton<ServicioUnico>();
constructor.Services.AddScoped<ServicioPorPeticion>();
// y AddTransient para uno por uso
```

.NET además **detecta en desarrollo** un error concreto: un objeto de única
instancia que depende de uno por petición. Lo llama dependencia cautiva y falla al
arrancar en lugar de comportarse mal en producción.

De los cuatro, es el único que convierte este error en un fallo temprano.

### Laravel — con una advertencia sobre PHP

```php
$app->singleton(ServicioUnico::class);
$app->bind(ServicioPorPeticion::class);
```

Y aquí un matiz que cambia el significado: **el servidor de desarrollo de PHP
atiende cada petición en un proceso nuevo**, así que «única instancia» dura lo que
dura la petición.

Con un gestor de procesos persistente el matiz cambia y el riesgo vuelve. Es el
mismo modelo de ejecución que la clase 014 obligó a tener en cuenta, y explica por
qué en PHP el estado compartido entre peticiones se ha resuelto históricamente con
infraestructura externa y no con variables.

## 🔬 Comparación

| Framework | Ámbito por omisión | ¿Detecta dependencias cautivas? |
| --- | --- | --- |
| Spring Boot | única instancia | no; usa proxy para que funcione |
| ASP.NET Core | ninguno: se declara siempre | **sí**, en desarrollo |
| NestJS | única instancia | no; propaga el ámbito hacia arriba |
| Laravel | por uso (`bind`) | no |

**El valor por omisión es el peligroso en tres de cuatro.** Única instancia es lo
barato y lo que casi nadie cambia, y es justo el que comparte estado.

## ⚠️ Errores frecuentes

- **Estado de petición en un objeto de única instancia.** El fallo caro.
- **Dependencia cautiva.** Un objeto único que depende de uno por petición.
- **Todo por petición «por si acaso».** Coste innecesario en objetos sin estado.
- **Suponer que el ámbito por omisión es el correcto.** En tres de cuatro es el
  arriesgado.
- **Guardar una conexión a base de datos en un objeto de única instancia** en
  lugar de usar el grupo de conexiones — clase 061.

## ✅ Verificación

```bash
node scripts/run-class.mjs 037
```

## 🧪 Reto de transferencia

Añade al servicio de única instancia un campo que guarde el último identificador
de correlación de la clase 030. Lanza dos peticiones **simultáneas** con
identificadores distintos y observa que una responde el de la otra. Después
arréglalo cambiando el ámbito. **Reproducir el fallo es el ejercicio.**

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 027 — El orden importa](../027-el-orden-importa/README.md) — el mismo fallo con otra cara
- [Módulo 02 — Arquitectura de frameworks](../../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@seemann-deursen-di] Seemann, Mark; van Deursen, Steven. *Dependency Injection Principles, Practices, and Patterns*. Manning, 2019. ISBN 9781617294730 — <https://openlibrary.org/isbn/9781617294730>
- [@owasp-top10] *OWASP Top 10*, OWASP Foundation — <https://owasp.org/www-project-top-ten/>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
