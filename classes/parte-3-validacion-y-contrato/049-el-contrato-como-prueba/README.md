# Clase 049 — El contrato como prueba

> [⬅️ 048](../048-etags-y-cache-condicional/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [050 ➡️](../050-que-rompe-a-quien/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Esta clase no enseña una capacidad nueva. Enseña **el método de todo el
programa**, y por qué las 38 clases anteriores significan algo.

## 🧩 La situación

Cuatro servidores. Un contrato de seis casos. **Ninguno conoce a los otros**,
ninguno comparte código, y el verificador no sabe qué framework hay al otro lado
del socket.

## 📖 Por qué eso importa

Una comparación entre frameworks solo significa algo si **lo que se compara es lo
mismo**.

Si cada framework tuviera su propia batería de pruebas —escrita por quien lo
conoce, con sus convenciones y su idea de qué es correcto— entonces «los cuatro
pasan» no diría nada: cada uno pasaría **su** examen.

Con un contrato único:

- Un fallo señala **una diferencia real de comportamiento**, no de estilo.
- Un verde significa **lo mismo** en los cuatro.
- Añadir un caso obliga a los cuatro a la vez, y ahí aparecen las divergencias.

Es exactamente lo que ocurrió a lo largo de estas clases. `Cache-Control` con
`private`, el 200 frente al 204 en la comprobación previa de CORS, el 400 en vez
del 422 ante un tipo equivocado, el `detalle` en inglés de Pydantic: **ninguna se
habría visto sin un contrato común**, porque cada framework por separado se
comportaba de forma razonable.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /tareas/1` | `200` con la tarea |
| `GET /tareas/999` | `404` · `NO_EXISTE` |
| `POST` con título en blanco | `422` · `VALIDACION` |
| `POST` válido | `201` + `Location: /tareas/2` |
| `DELETE /tareas/2` | `204` sin cuerpo |
| `GET /tareas/2` | `404` |

Seis casos que recorren lo esencial de la parte 1 y la parte 3. Deliberadamente
modesto: **el contrato no está para lucirse, está para ser el mismo**.

## 🌐 Lo que el verificador no sabe

```bash
node scripts/run-class.mjs 049
```

El verificador arranca un proceso, espera al puerto, envía peticiones HTTP y
compara respuestas. **No importa qué hay dentro.**

Esa ignorancia es la propiedad valiosa: es la misma que tiene un cliente real. Un
navegador o una aplicación móvil tampoco saben si detrás hay Express o Spring
Boot — solo ven códigos, cabeceras y cuerpos.

Probar exactamente eso, y nada más, es lo que hace que la prueba sobreviva a un
refactor, a un cambio de biblioteca y hasta a un cambio de framework. Freeman y
Pryce lo defienden como la propiedad que distingue una prueba útil de una que
solo repite la implementación [@freeman-pryce-goos].

## 🌐 Las implementaciones

Las cuatro están en [`implementaciones/`](implementaciones/) y son
deliberadamente sencillas: leer, crear, borrar. Lo interesante no es el código —
es que **ninguna sabe que las otras existen** y las cuatro cumplen lo mismo.

## 🔬 Comparación

| Framework | Líneas del servidor | Casos que pasa |
| --- | --- | --- |
| Express | 30 | 6 de 6 |
| FastAPI | 38 | 6 de 6 |
| Spring Boot | 62 | 6 de 6 |
| ASP.NET Core | 35 | 6 de 6 |

La columna de la derecha es idéntica **a propósito**. Es el resultado que hace
comparable la columna de la izquierda: si los cuatro cumplen lo mismo, entonces
las diferencias de longitud, de estilo y de ceremonia se pueden discutir sin que
nadie tenga que aclarar «ya, pero el mío también hace X».

## 🧭 Dónde encaja esto en una estrategia de pruebas

Este contrato es una **prueba de comportamiento externo**: arranca el sistema y
lo usa por su interfaz pública.

| Nivel | Qué prueba | Coste | Qué no ve |
| --- | --- | --- | --- |
| Unidad | una función | mínimo | la integración |
| Integración | varias piezas | medio | el contrato HTTP |
| **Contrato** | **el comportamiento externo** | alto | los caminos internos |

No sustituye a las otras: **es lenta y no dice dónde está el fallo**, solo que
existe. Lo que aporta es que **no se puede engañar**: no conoce nombres de
funciones ni estructuras internas, así que un refactor completo la deja intacta y
un cambio de comportamiento la rompe siempre.

La clase 126 desarrolla el reparto entre niveles.

## ⚠️ Errores frecuentes

- **Una batería por framework.** Cada uno pasa su examen y la comparación se
  evapora.
- **Adaptadores por implementación.** El adaptador acaba tapando la diferencia
  que querías ver.
- **Probar detalles internos.** Se rompe con cada refactor y no detecta nada.
- **Contrato demasiado estricto.** Exigir más de lo que exige el estándar mide la
  implementación — el error que esta parte cometió tres veces.
- **Contrato demasiado laxo.** Pasa todo y no garantiza nada.
- **Solo el camino feliz.** Los errores también son contrato.

## ✅ Verificación

```bash
node scripts/run-class.mjs 049
```

## 🧪 Reto de transferencia

Escribe una **quinta implementación** en el framework que quieras —Flask, Gin,
Laravel, el que sea—, añádela a la carpeta con su `ejecutar.json`, y consíguela
en verde **sin tocar el contrato**. Si necesitas cambiar el contrato para que
pase, o el contrato estaba mal o tu implementación no cumple. Averiguar cuál de
las dos es el ejercicio.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 129 — Pruebas de contrato](../../parte-10-calidad-y-operacion/129-pruebas-de-contrato/README.md)
- [Módulo 08 — Calidad, rendimiento y operación](../../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@freeman-pryce-goos] Freeman, Steve; Pryce, Nat. *Growing Object-Oriented Software, Guided by Tests*. Addison-Wesley, 2009. ISBN 9780321503626 — <https://openlibrary.org/isbn/9780321503626>
- [@fowler-test-pyramid] Fowler, Martin. *TestPyramid* — <https://martinfowler.com/bliki/TestPyramid.html>
- [@humble-farley-continuous-delivery] Humble, Jez; Farley, David. *Continuous Delivery*. Addison-Wesley, 2010. ISBN 9780321601919 — <https://openlibrary.org/isbn/9780321601919>
