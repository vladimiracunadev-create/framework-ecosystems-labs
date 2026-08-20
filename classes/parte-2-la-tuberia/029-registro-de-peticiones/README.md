# Clase 029 — Registro de peticiones

> [⬅️ 028](../028-terminacion-temprana/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [030 ➡️](../030-identificador-de-correlacion/README.md)
>
> Parte **2 — La tubería** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Emitir **una línea por petición** con lo que de verdad sirve para diagnosticar, y
entender por qué esa línea solo puede escribirse al final.

## 🧩 La situación

Cada petición deja una entrada con método, ruta, estado y duración. Una petición
que responde 200 y otra que responde 500 dejan **la misma forma de línea con
estado distinto**.

## 📖 Por qué al final y no al principio

Al entrar sabes el método y la ruta. **No sabes el estado ni la duración**, que
son justo los dos campos por los que se busca cuando algo va mal.

Por eso las cuatro implementaciones registran al terminar:

| Framework | Momento |
| --- | --- |
| Express | evento `finish` de la respuesta |
| FastAPI | después de `await siguiente(peticion)` |
| ASP.NET Core | después de `await siguiente()` |
| Spring Boot | después de `cadena.doFilter(...)` |

Es la parte de vuelta de la pila de la clase 027: **el código después de continuar
se ejecuta con la respuesta ya hecha**.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /ok` | `200` |
| `GET /falla` | `500` |
| `GET /registro` | las dos líneas, con su estado real |

El contrato comprueba que el 500 **se registró como 500**. Un registro que
anotara 200 para todo sería peor que no tenerlo: daría confianza falsa.

## 🔍 Un detalle que costó una corrección

La consulta a `/registro` **no se registra a sí misma**. Sin esa exclusión, mirar
el registro lo ensucia, y en un panel que consulta cada segundo el ruido tapa el
tráfico real.

La primera versión de Express funcionaba por accidente: el evento `finish` llega
después de construir el cuerpo, así que la línea de `/registro` no aparecía en la
respuesta que devolvía. **Pasaba la prueba por temporización, no por diseño.** Se
hizo explícita, como en los otros tres.

Es un ejemplo pequeño de algo importante: **una prueba verde no significa que el
código sea correcto**, significa que en esa ejecución se comportó como se
esperaba.

## 🌐 Las implementaciones

Las cuatro registran **al terminar**, no al entrar, y las cuatro excluyen la
consulta del propio registro. El código está en
[`implementaciones/`](implementaciones/).

## 🔬 Comparación

| Framework | Momento del registro | ¿Trae registro de peticiones? |
| --- | --- | --- |
| ASP.NET Core | tras `await siguiente()` | sí, configurable |
| Spring Boot | tras `cadena.doFilter` | sí, desactivado por omisión |
| FastAPI | tras `await siguiente(peticion)` | no |
| Express | evento `finish` | no |

Los dos primeros lo traen y ninguno lo activa con el formato que querrías: en
los cuatro acabas escribiendo la capa para controlar qué campos salen.

## 📖 Qué debe llevar la línea

| Campo | Por qué |
| --- | --- |
| método y ruta | qué se pidió |
| estado | cómo acabó |
| duración | si fue lento y cuánto |
| identificador de correlación | para unir esta línea con las de otros servicios — clase 030 |
| usuario o inquilino | para filtrar por afectado |

Y qué **no** debe llevar, porque acaba en un sistema que mucha gente puede leer:
contraseñas, credenciales, tarjetas, datos personales y cuerpos completos de
petición.

La ruta con parámetros merece un cuidado especial: registrar
`/usuarios/12345/token/abcdef` mete un secreto en el registro. Conviene registrar
**la plantilla** —`/usuarios/:id/token/:valor`— y no el valor.

## 📊 El paso siguiente: texto o estructura

Estas cuatro implementaciones acumulan objetos, que es lo que hace verificable el
contrato. En producción la decisión real es otra:

- **Texto plano** — legible por una persona, penoso de consultar.
- **JSON por línea** — feo de leer, y **consultable**: «todas las peticiones con
  estado 500 y duración mayor de un segundo» es una consulta, no un `grep` con
  expresiones regulares.

La clase 130 desarrolla esa decisión, y Majors y sus coautores la enmarcan en algo
más amplio: un sistema es observable cuando puedes responder preguntas que no
habías previsto [@majors-observability]. Una línea de texto libre no lo permite;
un objeto con campos estables, sí.

## ⚠️ Errores frecuentes

- **Registrar al entrar.** Te pierdes el estado y la duración.
- **Registrar secretos.** Contraseñas o credenciales en un sistema que mucha
  gente lee.
- **Registrar el cuerpo completo.** Volumen y datos personales.
- **Registrar la ruta con sus valores** en lugar de la plantilla.
- **Registrar la propia consulta del registro.** Ruido que se realimenta.
- **Registrar en texto libre** y descubrir a los seis meses que no se puede
  consultar.

## ✅ Verificación

```bash
node scripts/run-class.mjs 029
```

## 🧪 Reto de transferencia

Cambia las cuatro implementaciones para emitir **una línea JSON** por petición en
la salida estándar, con campos idénticos en los cuatro. Después comprueba que
`node scripts/run-class.mjs 029` sigue en verde: el contrato no cambia porque el
formato del registro no es parte del contrato HTTP.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 030 — Identificador de correlación](../030-identificador-de-correlacion/README.md)
- [Módulo 08 — Calidad, rendimiento y operación](../../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@majors-observability] Majors, Charity; Fong-Jones, Liz; Miranda, George. *Observability Engineering*. O'Reilly Media, 2022. ISBN 9781492076445 — <https://openlibrary.org/isbn/9781492076445>
- [@beyer-sre] Beyer, Betsy; Jones, Chris; Petoff, Jennifer; Murphy, Niall Richard. *Site Reliability Engineering*. O'Reilly Media, 2016. ISBN 9781491929124 — <https://openlibrary.org/isbn/9781491929124>
