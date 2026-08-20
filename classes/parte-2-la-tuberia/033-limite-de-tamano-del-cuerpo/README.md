# Clase 033 — Límite de tamaño del cuerpo

> [⬅️ 032](../032-tiempos-de-espera/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [034 ➡️](../034-limitacion-de-tasa/README.md)
>
> Parte **2 — La tubería** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Rechazar lo excesivo **antes de leerlo entero**. Es el mismo principio de la
clase 021 aplicado a cualquier cuerpo, no solo a los archivos.

## 🧩 La situación

Un cuerpo pequeño se acepta con 201. Uno por encima de 1 KB responde **413**. Y
el servicio sigue en pie después del rechazo.

## 📖 Dos comprobaciones, no una

Un cuerpo grande se puede rechazar en dos momentos, y hacen falta los dos:

**1. Por la cabecera `Content-Length`.** Si el cliente declara 50 MB y tu tope es
1 KB, se rechaza **sin leer un solo byte**. Es la comprobación barata.

**2. Durante la lectura.** Un cliente puede **omitir** `Content-Length` y enviar
el cuerpo troceado. Entonces no hay nada que declarar y el tope hay que aplicarlo
contando lo que llega.

Confiar solo en la primera deja la puerta abierta: basta con no declarar el
tamaño. Es un caso claro de por qué **una comprobación sobre datos que controla el
cliente no puede ser la única**.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| cuerpo pequeño | `201` |
| cuerpo mayor que 1 KB | `413` |
| cuerpo pequeño otra vez | `201` — el servicio sigue |

## 🌐 Las implementaciones

Las cuatro rechazan por encima de 1 KB y **lo hacen en capas distintas**: una en
el servidor, una en el analizador y dos en el propio código. Dónde vive el límite
es lo que decide si se puede olvidar.

### Dónde vive el límite

### Express — en la capa que analiza

```javascript
app.use(express.json({ limit: "1kb" }));
```

Una opción. El error llega al manejador de errores como `entity.too.large` y hay
que traducirlo a 413 — **sin ese manejador, el formato del error no es el tuyo**.

### FastAPI — las dos comprobaciones, a mano

```python
declarada = peticion.headers.get("content-length")
if declarada is not None and declarada.isdigit() and int(declarada) > LIMITE:
    return ...413...
```

Y después, sobre lo leído:

```python
if len(crudo) > LIMITE:
    return ...413...
```

Starlette no trae límite de cuerpo, así que las dos comprobaciones son
explícitas. Es más código y **es la implementación donde mejor se ve el
mecanismo**.

### ASP.NET Core — en el servidor

```csharp
constructor.WebHost.ConfigureKestrel(opciones =>
{
    opciones.Limits.MaxRequestBodySize = 1024;
});
```

**La defensa está por debajo de tu código.** Kestrel corta antes de que el
manejador exista, y lanza una excepción que se traduce a 413. Es el modelo más
robusto: no depende de que nadie se acuerde.

### Spring Boot — el hueco que conviene conocer

```java
if (peticion.getContentLengthLong() > LIMITE) {
    throw new CuerpoExcedido();
}
```

Spring trae límite para **multipart** —`spring.servlet.multipart.max-file-size`,
que usa la clase 021— y **no** para cuerpos JSON corrientes. Hay que ponerlo, o
delegarlo en el contenedor o en el servidor de entrada.

Es un hueco fácil de pasar por alto precisamente porque el de multipart sí existe.

## 🔬 Comparación

| Framework | Dónde vive | ¿Antes de tu código? | ¿Cubre sin `Content-Length`? |
| --- | --- | --- | --- |
| ASP.NET Core | servidor (Kestrel) | **sí** | sí |
| Express | opción del analizador | sí | sí |
| FastAPI | tu capa + tu manejador | no | sí, si lo escribes |
| Spring Boot | tu código (para JSON) | no | **no**, si solo miras la cabecera |

La columna del medio es la que decide en un incidente: **si la defensa está por
debajo, no se puede olvidar**. Adkins y sus coautores llaman a eso poner el
control en la capa donde no se puede saltar por descuido
[@adkins-building-secure-reliable].

## 🧭 Qué límite poner

No hay número universal, y hay un criterio: **el mayor cuerpo legítimo de tu API,
más un margen**.

Un tope demasiado alto no protege. Uno demasiado bajo rompe casos reales y, lo
que es peor, **rompe en producción con datos grandes** que en desarrollo no
existían.

Y conviene tenerlo por ruta cuando difieren mucho: 1 KB para crear una tarea y
10 MB para subir un adjunto es más sensato que 10 MB para todo.

## ⚠️ Errores frecuentes

- **Fiarse solo de `Content-Length`.** El cliente puede no enviarlo.
- **Leer entero y medir después.** El daño ya está hecho.
- **Devolver 400 en lugar de 413.** El cliente no sabe que el problema es el
  tamaño.
- **Un solo límite para toda la API.** O protege poco o rompe algo.
- **Poner el límite solo en la aplicación** cuando hay un servidor de entrada
  delante que acepta cualquier cosa.

## ✅ Verificación

```bash
node scripts/run-class.mjs 033
```

## 🧪 Reto de transferencia

Envía un cuerpo grande **sin `Content-Length`**, usando codificación troceada, y
comprueba cuáles de las cuatro implementaciones lo rechazan igual. Es el caso que
distingue una defensa real de una comprobación de cortesía.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 021 — Subida de archivos](../../parte-1-responder/021-subida-de-archivos/README.md)
- [Módulo 07 — Identidad y seguridad](../../../curriculum/07-identidad-y-seguridad.md)

## Fuentes

- [@adkins-building-secure-reliable] Adkins, Heather; Beyer, Betsy; Blankinship, Paul; Lewandowski, Piotr; Oprea, Ana; Stubblefield, Adam. *Building Secure and Reliable Systems*. O'Reilly Media, 2020. ISBN 9781492083122 — <https://openlibrary.org/isbn/9781492083122>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@owasp-asvs] *OWASP Application Security Verification Standard*, OWASP Foundation — <https://owasp.org/www-project-application-security-verification-standard/>
