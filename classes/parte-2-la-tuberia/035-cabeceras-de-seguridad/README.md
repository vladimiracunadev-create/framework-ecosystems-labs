# Clase 035 — Cabeceras de seguridad

> [⬅️ 034](../034-limitacion-de-tasa/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [036 ➡️](../036-inyeccion-de-dependencias/README.md)
>
> Parte **2 — La tubería** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Aplicar **las defensas que el navegador respeta si se las pides**, y entender qué
protege cada una — no copiar cinco líneas de una guía.

## 🧩 La situación

Toda respuesta lleva cinco cabeceras de seguridad y **no** lleva la firma del
servidor.

## 📖 Las cinco, y qué evita cada una

| Cabecera | Qué impide |
| --- | --- |
| `x-content-type-options: nosniff` | Que el navegador adivine el tipo por el contenido y ejecute como script algo servido como texto |
| `x-frame-options: DENY` | Que tu página se incruste en un marco ajeno y el usuario pulse sin saber dónde |
| `strict-transport-security` | Que una visita posterior use HTTP y sea interceptable |
| `content-security-policy` | Que se cargue o ejecute lo que no has autorizado |
| `referrer-policy: no-referrer` | Que la URL completa —con sus parámetros— se filtre al salir del sitio |

Las cinco están recogidas en las guías de OWASP [@owasp-cheatsheets], y las cinco
comparten una propiedad que conviene tener clara:

> **Son instrucciones para el navegador, no defensas del servidor.**

Un cliente que no sea un navegador las ignora por completo. Protegen a **tus
usuarios** de ataques que se ejecutan en su navegador — no protegen tu API de un
atacante con `curl`. Es la misma distinción que la clase 024 hacía con CORS.

## 🔒 La que más protege y más cuesta

`content-security-policy` es la única de las cinco que **puede romper tu
aplicación**, y por eso es la que más se omite.

La política de esta clase, `default-src 'none'`, no permite cargar absolutamente
nada. Sirve para una API que solo devuelve JSON. En una aplicación con interfaz
hay que enumerar orígenes, y ahí es donde aparece la fricción: un script en
línea, un estilo incrustado o un recurso de un tercero dejan de funcionar.

La forma sensata de adoptarla es en dos pasos: **primero en modo informe**
—`content-security-policy-report-only`, que no bloquea y avisa—, se recoge lo que
habría roto, y después se activa. La clase 077 lo desarrolla.

## 🧮 El contrato

Las cinco cabeceras presentes, y `x-powered-by` **ausente**.

Esa última no es una defensa: quitar la firma del servidor no impide nada. Es
**no regalar información**: la versión exacta del framework le dice al atacante
qué vulnerabilidades conocidas probar primero. Cuesta una línea y ahorra un paso
de reconocimiento.

## 🌐 Las implementaciones

Las cuatro hacen lo mismo. Un detalle merece atención, en FastAPI:

```python
respuesta.headers.setdefault(nombre, valor)
```

**`setdefault` y no asignación directa.** Si un manejador concreto puso una
política más estricta para su ruta, la capa general no debe pisarla. Con
asignación, la capa —que corre después— borraría la decisión más informada.

Es un patrón que vale para cualquier capa transversal: **poner un valor por
omisión, no imponer un valor**.

Y en Spring Boot, un aviso honesto:

```java
// Spring Security trae estas cabeceras puestas y bien configuradas.
```

Aquí se ponen a mano para que se vean. **En un proyecto real, añadir Spring
Security es la respuesta correcta**: las trae activadas por omisión y añade mucho
más. Escribir el filtro a mano es un ejercicio, no una recomendación.

## 🔬 Comparación

| Framework | ¿Trae alguna por omisión? | Solución habitual |
| --- | --- | --- |
| Spring Boot | con Spring Security, **todas** | añadir Spring Security |
| ASP.NET Core | ninguna | capa propia o biblioteca |
| Express | ninguna, y **añade `x-powered-by`** | biblioteca conocida |
| FastAPI | ninguna | capa propia |

**Tres de cuatro no traen ninguna.** Y Express va más allá: añade `x-powered-by:
Express` por su cuenta, que es exactamente lo contrario de lo que conviene.

Esa fila resume el criterio del
[módulo 11](../../../curriculum/11-seleccion-y-sostenibilidad.md): **los valores
por omisión de un framework dicen qué priorizó quien lo escribió**. Express
priorizó no estorbar; Spring Security priorizó la defensa. Ninguno se equivoca —
hay que saber cuál te tocó.

## ⚠️ Errores frecuentes

- **Copiar las cinco sin saber qué hacen.** La primera que rompa algo se
  desactiva sin entender qué se pierde.
- **Activar la política de contenido de golpe** en una aplicación con interfaz.
- **`strict-transport-security` sin HTTPS bien montado.** El navegador recuerda
  la instrucción y el sitio queda inaccesible.
- **Creer que protegen la API.** Solo actúan en el navegador.
- **Dejar `x-powered-by`.** Información gratis para quien hace reconocimiento.

## ✅ Verificación

```bash
node scripts/run-class.mjs 035
```

## 🧪 Reto de transferencia

Sirve una página HTML con un script en línea y comprueba que la política la
bloquea. Después añade el origen mínimo que lo permita, **sin usar `unsafe-inline`**
—que anularía la protección— y explica qué mecanismo usaste en su lugar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 077 — Política de seguridad de contenido](../../parte-5-identidad-y-seguridad/077-politica-de-seguridad-de-contenido/README.md)
- [Módulo 07 — Identidad y seguridad](../../../curriculum/07-identidad-y-seguridad.md)

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series*, OWASP Foundation — <https://cheatsheetseries.owasp.org/>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
- [@mdn-web-docs] *MDN Web Docs*, Mozilla — <https://developer.mozilla.org/>
