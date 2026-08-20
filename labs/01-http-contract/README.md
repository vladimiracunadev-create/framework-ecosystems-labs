# Laboratorio 01 — Referencia sin framework

El patrón de medida del programa. Implementa el contrato completo usando **solo
módulos nativos del runtime**: sin dependencias, sin instalación, sin nada que
descargar.

```bash
node --test labs/01-http-contract/reference-node/server.test.mjs
node scripts/run-acceptance.mjs reference-node
```

## Por qué existe

Todo framework web es una forma de escribir menos HTTP a mano. Esta referencia
muestra **exactamente qué** se escribe a mano, para que al comparar con las otras
cuatro implementaciones se sepa qué se está ahorrando y qué se está delegando.

## Lo que aquí es explícito y en otros sitios no

| Decisión | Aquí | En un framework |
| --- | --- | --- |
| Enrutado | Comparaciones sobre método y ruta | Tabla de rutas o convención de archivos |
| Límite del cuerpo | Comprobado mientras llega, con eventos | Opción de configuración |
| Sobre de error | Función única con catálogo cerrado | Traductor de excepciones |
| Orden de comprobaciones | Escrito en el manejador | Orden de la cadena de extensiones |
| Cierre correcto | `SIGINT` y `SIGTERM` a mano | Ciclo de vida del framework |

## La decisión que más cuesta descubrir

La lectura del cuerpo usa eventos y **no** `for await`. Salir de un `for await`
destruye el flujo, y destruir el flujo cierra el socket antes de que la respuesta
`413` salga: el cliente vería una conexión cortada en lugar del error que explica
qué pasó. Rechazar una petición y rechazarla **comunicando por qué** no son lo
mismo, y el segundo comportamiento cuesta diez líneas más.

Cuando el cuerpo supera el límite, el resto se descarta sin acumularlo hasta un
tope, y solo entonces se corta la conexión: cortesía con el cliente honesto que
envió de más, límite firme frente al que no lo es.

## Pruebas

- `server.test.mjs` comprueba las decisiones **internas**: validación pura sin
  abrir puerto, límites inclusivos, conflicto de idempotencia y ausencia de
  filtraciones.
- [`contracts/taskflow/acceptance.test.mjs`](../../contracts/taskflow/acceptance.test.mjs)
  comprueba el **contrato** desde fuera, y es idéntico para las cinco
  implementaciones.

La primera prueba del archivo resume el módulo 02: la validación se ejercita sin
arrancar ningún servidor, porque es una regla de dominio y no de transporte.
