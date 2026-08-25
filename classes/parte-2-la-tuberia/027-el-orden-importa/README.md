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

## 🌐 Las implementaciones — el código a la vista

Las cuatro registran tres capas y guardan la traza **en la petición**. Y las
cuatro declaran el orden de una manera distinta — una de ellas al revés de lo
que parece.

Antes de mirar el orden, mira dónde vive la traza, porque es la parte que este
contrato destapó en el primer intento.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — el orden es el de registro

```javascript
function capa(nombre) {
  return (peticion, respuesta, siguiente) => {
    peticion.traza ??= [];
    peticion.traza.push(`entra:${nombre}`);
    siguiente();
```

```javascript
app.use(capa("uno"));
app.use(capa("dos"));
app.use(capa("tres"));
```

Lo que se lee de arriba abajo se ejecuta de fuera adentro.

Y el detalle que importa más que el orden: **la traza vive en la petición**, no
en una variable del módulo. Con estado global, dos peticiones simultáneas
mezclarían sus trazas — y este contrato lo destapó en el primer intento del
laboratorio, que es exactamente el tipo de fallo que en producción aparece solo
bajo carga.

Lo que se escriba **después** de `siguiente()` se ejecuta al volver, en orden
inverso. No entra en el cuerpo de la respuesta porque para entonces ya salió.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — igual, y el más explícito

```csharp
void Capa(string nombre) => app.Use(async (contexto, siguiente) =>
{
    if (!contexto.Items.TryGetValue("traza", out var valor))
    {
        valor = new List<string>();
        contexto.Items["traza"] = valor;
    }
    ((List<string>)valor!).Add($"entra:{nombre}");
    await siguiente();
```

```csharp
Capa("uno");
Capa("dos");
Capa("tres");
```

Mismo modelo que Express: **el orden es el de las llamadas**. `contexto.Items`
es el almacén por petición — nace y muere con ella, igual que `peticion.traza`.

Es el modelo más predecible de los cuatro, y por eso la documentación de ASP.NET
Core insiste tanto en el orden de las llamadas `Use`: es la única declaración que
hay.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — **al revés**

```python
app.middleware("http")(capa("tres"))
app.middleware("http")(capa("dos"))
app.middleware("http")(capa("uno"))
```

Léelo dos veces: para obtener el orden observable `uno, dos, tres` hay que
**registrarlas al revés**.

Las capas de Starlette **se apilan**: la última registrada envuelve a las
anteriores, así que se ejecuta primero. No es un capricho — es la consecuencia
natural de construir la pila envolviendo la aplicación una y otra vez.

Y es **la trampa número uno** de quien viene de Express. Lo peor es que no
produce un error: produce un orden distinto, silencioso, que solo se nota cuando
la capa de autenticación acaba ejecutándose después de la que necesitaba saber
quién eres.

```python
        if not hasattr(peticion.state, "traza"):
            peticion.state.traza = []
        peticion.state.traza.append(f"entra:{nombre}")
```

`peticion.state` es el almacén por petición de Starlette. Mismo papel,
tercer nombre.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — ni una cosa ni la otra

```java
    private static FilterRegistrationBean<Filter> registrar(String nombre, int orden) {
        FilterRegistrationBean<Filter> registro = new FilterRegistrationBean<>(new Capa(nombre));
        registro.setOrder(orden);
        return registro;
    }
```

```java
    @Bean
    public FilterRegistrationBean<Filter> uno() {
        return registrar("uno", 1);
    }
```

**El orden se declara con un número**, no se deduce de nada — ni de la posición
en el archivo, ni del momento del registro.

Es más verboso y elimina una dependencia peligrosa: **el orden en que Spring
descubre los componentes no está garantizado**. Dejar el orden implícito sería
dejar el comportamiento al azar, y la clase 002 ya avisó de que en Spring el
descubrimiento es un examen del classpath y no una secuencia de llamadas.

```java
            List<String> traza = (List<String>) peticion.getAttribute("traza");
            if (traza == null) {
                traza = new ArrayList<>();
                peticion.setAttribute("traza", traza);
            }
            traza.add("entra:" + nombre);
            cadena.doFilter(peticion, respuesta);
```

Los atributos de la petición son el almacén por petición del mundo de los
servlets. **Cuarto nombre para lo mismo**: `peticion.traza`, `contexto.Items`,
`peticion.state` y `getAttribute`. Cuando cuatro frameworks de cuatro
ecosistemas inventan la misma pieza, es que el problema es del dominio y no de
ninguno de ellos.

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
