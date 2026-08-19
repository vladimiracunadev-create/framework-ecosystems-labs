# Laboratorio 01 — HTTP antes del framework

## Objetivo

Observar routing, parsing, validación, errores, estado, idempotencia y cierre usando solo Node.js. El ejercicio hace visible la complejidad que luego administran los frameworks.

## Ejecutar

```bash
node labs/01-http-contract/reference-node/server.mjs
```

En otra terminal:

```bash
curl http://127.0.0.1:3000/health
```

## Probar

```bash
node --test labs/01-http-contract/reference-node/server.test.mjs
```

## Preguntas

- ¿Qué responsabilidades se repiten por ruta?
- ¿Dónde se normalizan errores?
- ¿Qué ocurriría con varios procesos?
- ¿Qué falta para producción?
- ¿Qué abstracción justificaría incorporar primero?

Detén el proceso con `Ctrl+C`. El estado es en memoria.
