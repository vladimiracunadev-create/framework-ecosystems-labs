# Laboratorio 03 — FastAPI

Validación declarativa: el modelo se declara con tipos y el framework valida por
ti. El laboratorio muestra la comodidad **y su factura**.

```bash
node scripts/run-acceptance.mjs fastapi --prepare
```

## La factura de la validación automática

El framework valida, pero su vocabulario de errores no es el del contrato. Hay
que traducirlo, y esa tabla es trabajo propio que no desaparece:

| Error de Pydantic | Código del contrato |
| --- | --- |
| `missing` | `TITLE_REQUIRED` |
| `string_type` | `TITLE_REQUIRED` |
| `string_too_short` | `TITLE_EMPTY` |
| `string_too_long` | `TITLE_TOO_LONG` |
| `json_invalid` | `400` `MALFORMED_JSON` |

Sin esa tabla, los clientes verían los códigos internos del framework, y una
actualización de Pydantic rompería el contrato sin que nadie lo hubiera tocado.

## Recortar antes de medir

`StringConstraints(strip_whitespace=True, min_length=1, max_length=120)` hace que
un título de solo espacios quede vacío y caiga en el mismo error que un título
sin contenido. Sin esa opción, tres espacios medirían tres caracteres y pasarían
la validación: el contrato lo rechaza y la implementación tiene que coincidir.

## El orden lo impone el contrato, no el framework

Las comprobaciones de tamaño, tipo de contenido y clave de idempotencia van en un
middleware que corre **antes** de que el framework analice nada. El motivo es de
seguridad: un límite que se aplica después de leer no protege de lo que ya se
leyó.

## Lo que hubo que añadir a mano

- `Allow` en el `405`: Starlette no siempre lo adjunta, y un `405` sin él deja al
  cliente adivinando qué método sí vale.
- El sobre `application/problem+json`: el formato por omisión es
  `{"detail": ...}`, que no es el del contrato.
