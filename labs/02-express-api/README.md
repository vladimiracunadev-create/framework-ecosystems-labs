# Laboratorio 02 — Express

Framework minimalista sobre Node.js: posee el bucle de peticiones y el orden de
la cadena, y deja casi todo lo demás en tus manos.

```bash
node scripts/run-acceptance.mjs express --prepare
```

## Qué cambia respecto a la referencia

| Aspecto | Referencia | Express |
| --- | --- | --- |
| Enrutado | Comparaciones a mano | `app.get` / `app.post` |
| Análisis del cuerpo | Propio, con límite | `express.json({ limit })` |
| Errores del framework | No existen | Hay que traducirlos en un middleware final |
| Métodos no admitidos | Rama explícita | `app.all` tras las rutas concretas |
| Ruta desconocida | Última rama | Middleware final, antes del traductor |

## El hallazgo del laboratorio

El tipo de contenido se comprueba **antes** de `express.json`, en un middleware
propio. Es contraintuitivo: parece que el analizador debería rechazar lo que no
sabe leer. Lo que hace en realidad es **ignorarlo** —si el `Content-Type` no
coincide, deja el cuerpo vacío y sigue— así que el fallo reaparece más adelante
disfrazado de error de validación, con el código equivocado.

Es un ejemplo exacto de la regla del módulo 02: lo explícito falla por omisión y
lo implícito falla por sorpresa.

## Traductor de errores

Express produce sus propios errores, que no conocen el catálogo del contrato:

| Error de Express | Se traduce a |
| --- | --- |
| `entity.too.large` | `413` `BODY_TOO_LARGE` |
| `entity.parse.failed` | `400` `MALFORMED_JSON` |
| cualquier otro | `500` `INTERNAL_ERROR`, sin detalle |

Sin ese traductor, el cliente recibiría el formato interno de una dependencia que
ni siquiera eligió, y una actualización de esa dependencia podría cambiar el
contrato sin que nadie tocara el repositorio.
