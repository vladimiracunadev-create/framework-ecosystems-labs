# Laboratorios

Cinco implementaciones del **mismo** contrato, evaluadas por las **mismas** 20
pruebas de aceptación. Ese es todo el diseño: sin contrato compartido no hay
comparación, y sin pruebas compartidas el contrato es una intención.

```bash
node scripts/run-acceptance.mjs                     # lista los destinos
node scripts/run-acceptance.mjs reference-node      # no necesita instalar nada
node scripts/run-acceptance.mjs express --prepare
node scripts/run-acceptance.mjs fastapi --prepare
node scripts/run-acceptance.mjs spring-boot --prepare
node scripts/run-acceptance.mjs aspnet --prepare
```

## Los cinco destinos

| Laboratorio | Ecosistema | Qué demuestra | Toolchain |
| --- | --- | --- | --- |
| [01 · Referencia](01-http-contract/README.md) | Node.js sin framework | Qué escribe un framework por ti | ninguna |
| [02 · Express](02-express-api/README.md) | Node.js | Framework minimalista: tú decides el orden | pnpm |
| [03 · FastAPI](03-fastapi/README.md) | Python | Validación derivada de los tipos, y su traductor | pip |
| [04 · Spring Boot](04-spring-boot/README.md) | JVM | Contenedor de dependencias y traductor de excepciones | JDK 21 + Maven |
| [05 · ASP.NET Core](05-aspnet-core/README.md) | .NET | API mínima y enlace automático de modelo | .NET 10 |

Además, dos laboratorios sin servidor propio:

| Laboratorio | Propósito |
| --- | --- |
| [06 · Comparación frontend](06-frontend-comparison/README.md) | La misma interfaz accesible en varios enfoques de UI |
| [07 · Migración de legado](07-legacy-migration/README.md) | Figura estranguladora con fachada y modo sombra |

## Qué se compara y qué no

**Sí se compara:** cuánto código propio exige el contrato, dónde vive el riesgo,
qué hace el framework por omisión, cómo se diagnostica un fallo y qué cuesta
traducir sus errores al catálogo del contrato.

**No se compara** —todavía— rendimiento. Una cifra de latencia sin el protocolo
de medición del módulo 08 es una anécdota con números; el repositorio prefiere no
publicar ninguna a publicar una que no se puede reproducir.

## Lo que reveló implementar el mismo contrato cinco veces

| Hallazgo | Dónde aparece |
| --- | --- |
| El orden de las comprobaciones —tamaño, tipo, clave, análisis, idempotencia, validación— **no** lo respeta el enlace automático de modelo | Spring Boot y ASP.NET obligan a leer el cuerpo a mano |
| Traducir los errores del framework al catálogo del contrato es trabajo propio en los cinco | El traductor único de cada implementación |
| El `405` sin cabecera `Allow` es el comportamiento por omisión más frecuente | FastAPI y Spring necesitaron añadirla |
| El límite de tamaño protege de verdad solo si se aplica **mientras** llega el cuerpo | Desviación declarada de Spring Boot |

Estos hallazgos valen más que una tabla de funcionalidades: son consecuencias
observadas del mismo requisito en ecosistemas distintos.

## «Adaptador pedagógico»

Ninguna de estas implementaciones es una plantilla productiva. Cumplen el
contrato y guardan el estado en memoria; les faltan persistencia, identidad,
observabilidad y despliegue. La distinción entre demostración mínima y plantilla
productiva es deliberada y está declarada.
