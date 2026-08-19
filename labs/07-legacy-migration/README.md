# Laboratorio 07 — Migración incremental

## Escenario

Una API heredada administra TaskFlow pero no posee pruebas. Se desea migrar a otro framework sin detener operación.

## Fases

1. Captura comportamiento real con pruebas de caracterización.
2. Coloca una fachada que conserve URL y errores.
3. Migra `GET /health` para verificar enrutamiento.
4. Migra `GET /tasks` en modo sombra y compara respuestas.
5. Enruta un porcentaje controlado de lecturas.
6. Mantén escrituras en el legado hasta resolver idempotencia y datos.
7. Migra una capacidad completa.
8. Retira solo después de observar y reconciliar.

## Fallos que debes diseñar

- nuevo servicio no disponible;
- respuestas semánticamente distintas;
- orden diferente;
- sesión no compartida;
- operación repetida durante timeout;
- cambio de esquema no reversible.

## Entrega

Diagrama, pruebas, métricas de divergencia, umbral de corte, procedimiento de rollback y criterios para detener la migración.
