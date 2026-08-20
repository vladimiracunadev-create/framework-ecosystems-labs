# Clase 034 — Limitación de tasa

> [⬅️ 033](../033-limite-de-tamano-del-cuerpo/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [035 ➡️](../035-cabeceras-de-seguridad/README.md)
>
> Parte **2 — La tubería** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Proteger el servicio del uso excesivo —**legítimo o no**— y decirle al cliente
cuándo puede volver.

## 🧩 La situación

Tres peticiones pasan. La cuarta responde **429** con `Retry-After`. Y cada
respuesta informa del cupo, del consumo restante y de cuándo se repone.

## 📖 Legítimo o no: la distinción importa

Se habla de limitación de tasa como defensa contra abusos, y **la mayoría de las
veces frena a clientes bien intencionados**: un bucle mal escrito, una
sincronización que se dispara, un reintento sin espera creciente.

De ahí que las cabeceras informativas no sean cortesía. Un cliente que ve
`ratelimit-remaining: 1` puede reducir el ritmo **antes** de que lo corten. Uno
que solo recibe un 429 seco no sabe qué hizo mal.

Y `Retry-After` es lo más importante de la respuesta: sin ella, el cliente
reintenta de inmediato y **multiplica la carga que provocó el corte**. Es la
espiral que Nygard describe cuando los reintentos no están amortiguados
[@nygard-release-it].

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| 1.ª, 2.ª, 3.ª | `200` |
| 4.ª | `429` |
| igual | `retry-after` presente |

## 📖 El algoritmo, en una frase

Las cuatro implementaciones usan un **cubo con ventana fija**: cada cliente tiene
N fichas, se gasta una por petición y se reponen todas al empezar la ventana
siguiente.

Es el más simple y tiene un defecto conocido: **el efecto borde**. Con un cupo de
100 por minuto, un cliente puede gastar 100 al final de un minuto y 100 al
principio del siguiente — 200 en dos segundos.

Las alternativas resuelven eso a cambio de complejidad:

| Algoritmo | Idea | Coste |
| --- | --- | --- |
| Ventana fija | fichas que se reponen de golpe | mínimo; efecto borde |
| Ventana deslizante | cuenta los últimos 60 segundos reales | más memoria |
| Cubo con goteo | las fichas se reponen gradualmente | permite ráfagas controladas |

Para casi todo, la ventana fija basta. Merece la pena saber por qué podría no
bastar.

## ⚠️ El problema que este código no resuelve

```javascript
const cubos = new Map();
```

**Un mapa en memoria del proceso.** Con dos instancias del servicio, cada una
tiene su propio cubo y el cupo real es el doble del declarado. Con diez, diez
veces.

No es un defecto de estas implementaciones: es la propiedad que define el
problema. **La limitación de tasa necesita estado compartido**, y por eso en un
despliegue real vive en un almacén externo o en el servidor de entrada, no en el
proceso de aplicación.

Es la misma conclusión de la clase 109 sobre el estado de conexión: **cuando el
estado tiene que ser único y hay varias instancias, el estado sale del proceso**.

## 🌐 Las implementaciones

Express, FastAPI y Spring Boot montan el cubo a mano —para que el algoritmo se
vea— y ASP.NET Core usa lo que trae la plataforma:

```csharp
opciones.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(contexto =>
    RateLimitPartition.GetFixedWindowLimiter(
        contexto.Connection.RemoteIpAddress?.ToString() ?? "anonimo",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 3, Window = TimeSpan.FromMinutes(1) }));
```

**.NET trae limitación de tasa en la biblioteca estándar**, con varios algoritmos
y particionado por clave. De los cuatro, es el único que no necesita biblioteca
externa ni código propio — y sigue teniendo el problema del estado por proceso.

## 🔬 Comparación

| Framework | ¿Incorporado? | Algoritmos | Estado |
| --- | --- | --- | --- |
| ASP.NET Core | **sí**, en la biblioteca estándar | cuatro, con particionado | por proceso |
| Express | no, con biblioteca | según la biblioteca | por proceso o externo |
| FastAPI | no | el que escribas | por proceso |
| Spring Boot | no en Boot a secas | según la pieza que añadas | por proceso o externo |

La última columna es la misma en las cuatro, y es la que importa: **ninguno
resuelve el estado compartido**. Ese problema no es del framework.

## 🔑 Por qué clave limitar

| Clave | Cuándo | Problema |
| --- | --- | --- |
| Dirección IP | clientes anónimos | una oficina entera comparte IP |
| Identificador de usuario | clientes autenticados | no protege el inicio de sesión |
| Clave de API | integraciones | hay que emitirlas |
| IP + ruta | proteger un punto caro | más estado |

La combinación habitual: **por IP en lo público, por usuario en lo autenticado, y
un límite más estricto en el inicio de sesión** — que es el punto donde la
limitación de tasa deja de ser rendimiento y pasa a ser seguridad, porque frena
el ensayo de contraseñas [@owasp-asvs].

## ⚠️ Errores frecuentes

- **429 sin `Retry-After`.** El cliente reintenta de inmediato.
- **Estado en memoria con varias instancias.** El cupo real es N veces el
  declarado.
- **Limitar por IP detrás de un servidor de entrada** sin leer la cabecera
  correcta: todas las peticiones parecen venir de la misma IP.
- **Fiarse de `X-Forwarded-For` sin validar.** La pone el cliente.
- **El mismo cupo para todo.** El inicio de sesión necesita uno mucho más
  estricto.
- **Limitar y no medir.** Sin métricas no sabes si estás cortando abuso o
  clientes.

## ✅ Verificación

```bash
node scripts/run-class.mjs 034
```

## 🧪 Reto de transferencia

Cambia una implementación a **ventana deslizante** y demuestra con dos peticiones
en el borde de la ventana que la de ventana fija deja pasar el doble. Es el
experimento que justifica la complejidad extra.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 109 — Estado de conexión con varias instancias](../../parte-8-tiempo-real-y-segundo-plano/109-estado-de-conexion-con-varias-instancias/README.md)
- [Módulo 08 — Calidad, rendimiento y operación](../../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@owasp-asvs] *OWASP Application Security Verification Standard*, OWASP Foundation — <https://owasp.org/www-project-application-security-verification-standard/>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
