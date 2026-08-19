# Pruebas de aceptación TaskFlow

| Caso | Acción | Resultado |
| --- | --- | --- |
| Salud | `GET /health` | 200 y `status=ok` |
| Lista inicial | `GET /tasks` | 200, arreglo vacío |
| Crear | `POST /tasks` válido con clave | 201, tarea incompleta |
| Repetir | mismo cuerpo y clave | 200, mismo identificador |
| Sin clave | crear sin `Idempotency-Key` | 400, error estable |
| Título vacío | crear con espacios | 422, `VALIDATION_ERROR` |
| Buscar | `GET /tasks/{id}` existente | 200, tarea |
| Ausente | `GET /tasks/{id}` desconocido | 404, `TASK_NOT_FOUND` |
| Tipo | POST sin JSON | 415, `UNSUPPORTED_MEDIA_TYPE` |

Las implementaciones adicionales deben automatizar estos casos. Si el framework usa otro valor por defecto, el adaptador conserva este contrato o registra una versión nueva.
