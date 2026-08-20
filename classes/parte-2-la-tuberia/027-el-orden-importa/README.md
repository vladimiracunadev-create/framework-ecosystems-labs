# Clase 027 — El orden importa

> [⬅️ 026](../026-el-patron-middleware/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [028 ➡️](../028-terminacion-temprana/README.md)
>
> Parte **2 — La tubería** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Predecir el efecto del orden de registro, y descubrir que **en dos de estos
cuatro frameworks el orden de ejecución no es el orden de lectura**.

## 🧩 La situación

Tres capas —`uno`, `dos`, `tres`— registran su entrada. El manejador registra la
suya. El resultado debe ser `uno, dos, tres, manejador` en los cuatro.

## 📖 Cómo se recorre una tubería

No es una cola: es una **pila**. Cada capa envuelve a la siguiente, así que la
petición entra de fuera adentro y la respuesta sale de dentro afuera:

```text
        entra                     sale
  uno  ──────►                        ◄────── uno
    dos  ──────►                    ◄────── dos
      tres ──────► [manejador] ◄────── tres
```

Eso tiene una consecuencia práctica muy concreta: **el código que escribas
después de continuar se ejecuta al volver**, con la respuesta ya generada. Ahí es
donde se mide la duración, se añade una cabecera calculada o se cierra un
recurso.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /traza` | `{"traza":["entra:uno","entra:dos","entra:tres","manejador"]}` |
| `GET /traza` otra vez | **lo mismo** |

El segundo caso comprueba algo que no parece de esta clase y resultó serlo: que
la traza **no se acumula entre peticiones**.

## 🔍 Lo que esta clase destapó

La primera versión guardaba la traza en una variable del módulo. El resultado fue
este:

```text
✘ express  json {"traza":["sale:uno","sale:dos","sale:tres","entra:uno",...]}
```

La traza de una petición aparecía en la respuesta de la siguiente. **Estado
global compartido entre peticiones**, que en un servidor es un fallo de
corrección y, cuando el estado contiene datos de usuario, un fallo de seguridad.

La solución es la que usan las cuatro implementaciones: guardar el estado **en la
petición**, no en el módulo.

| Framework | Almacén por petición |
| --- | --- |
| Express | propiedad en el objeto `peticion` |
| FastAPI | `peticion.state` |
| Spring Boot | atributos de la petición (`setAttribute`) |
| ASP.NET Core | `contexto.Items` |

Los cuatro tienen uno, y no por casualidad: **es el mecanismo correcto para
cualquier dato que pertenezca a una petición concreta** — el usuario
autenticado, el identificador de correlación de la clase 030, el inquilino en una
aplicación multiempresa.

## 🌐 Las implementaciones

Las cuatro registran tres capas y guardan la traza **en la petición**. El código
está en [`implementaciones/`](implementaciones/); lo que sigue destaca cómo
declara el orden cada una.

### ASP.NET Core — el orden es el de registro

```csharp
Capa("uno");
Capa("dos");
Capa("tres");
```

Lo que se lee de arriba abajo se ejecuta de fuera adentro. **El modelo más
predecible de los cuatro**, y por eso su documentación insiste tanto en el orden
de las llamadas `Use`.

### Express — igual

```javascript
app.use(capa("uno"));
app.use(capa("dos"));
app.use(capa("tres"));
```

### FastAPI — **al revés**

```python
app.middleware("http")(capa("tres"))
app.middleware("http")(capa("dos"))
app.middleware("http")(capa("uno"))
```

Las capas de Starlette **se apilan**: la última registrada envuelve a las
anteriores, así que se ejecuta primero. Para obtener el orden `uno, dos, tres`
hay que registrarlas al revés.

No es un capricho: es la consecuencia natural de construir la pila envolviendo la
aplicación una y otra vez. Y es **la trampa número uno** de quien viene de
Express.

### Spring Boot — ni una cosa ni la otra

```java
FilterRegistrationBean<Filter> registro = new FilterRegistrationBean<>(new Capa(nombre));
registro.setOrder(orden);
```

El orden **se declara con un número**, no se deduce de nada. Es más verboso y
elimina una dependencia peligrosa: el orden en que Spring descubre los
componentes **no está garantizado**, así que dejar el orden implícito sería dejar
el comportamiento al azar.

## 🔬 Comparación

| Framework | Orden de ejecución | Riesgo |
| --- | --- | --- |
| ASP.NET Core | el de registro | ninguno; es lo esperable |
| Express | el de registro | ninguno |
| Spring Boot | el número declarado | olvidar declararlo deja el orden indefinido |
| FastAPI | **el inverso al de registro** | leer el código y equivocarse |

## 🎯 Por qué el orden decide comportamiento

No es una curiosidad. Cuatro ejemplos donde el orden cambia el resultado:

| Si pones… | antes de… | Pasa que… |
| --- | --- | --- |
| autenticación | limitación de tasa | gastas CPU autenticando peticiones que ibas a rechazar |
| compresión | caché | cacheas lo comprimido y no puedes servirlo a quien no lo admite |
| manejo de errores | el resto | no captura los errores de las capas que van después |
| registro | todo lo demás | no ves el estado final, porque otra capa lo cambió al volver |

La tercera es la más común: un manejador de errores registrado el primero **no ve
los errores de las capas posteriores**, porque en la ida ya pasó de largo.

## ⚠️ Errores frecuentes

- **Suponer que el orden de lectura es el de ejecución.** En FastAPI no lo es.
- **No declarar el orden en Spring.** Lo indefinido funciona hasta que deja.
- **Guardar estado de petición en una variable global.** Es el fallo que esta
  clase destapó.
- **Registrar el manejador de errores demasiado pronto.**
- **Poner la capa cara antes de la que descarta.**

## ✅ Verificación

```bash
node scripts/run-class.mjs 027
```

## 🧪 Reto de transferencia

Añade a cada capa un registro **al volver** —`sale:uno`, etc.— y comprueba en la
salida del proceso que el orden es `tres, dos, uno`. No entra en el cuerpo de la
respuesta porque para entonces ya se envió, y **entender por qué** es el objetivo
del reto.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 028 — Terminación temprana](../028-terminacion-temprana/README.md)
- [Módulo 02 — Arquitectura de frameworks](../../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@gof-design-patterns] Gamma, Erich; Helm, Richard; Johnson, Ralph; Vlissides, John. *Design Patterns*. Addison-Wesley, 1994. ISBN 9780201633610 — <https://openlibrary.org/isbn/9780201633610>
- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*. Yaknyam Press, 2018. ISBN 9781732102200 — <https://openlibrary.org/isbn/9781732102200>
