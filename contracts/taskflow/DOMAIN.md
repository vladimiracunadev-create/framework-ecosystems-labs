# TaskFlow — Dominio canónico

TaskFlow administra tareas personales para estudiar contratos y frameworks.

## Reglas iniciales

- Una tarea posee identificador, título, estado y fecha de creación.
- El título recortado contiene entre 1 y 120 caracteres.
- Una tarea nueva comienza incompleta.
- La creación exige una clave de idempotencia.
- Repetir la misma clave devuelve la tarea creada y no duplica datos.
- Una tarea inexistente produce un error estable `TASK_NOT_FOUND`.
- La primera versión usa memoria; los módulos posteriores incorporan propietario, persistencia e historial.

## Fuera de alcance inicial

Autenticación real, colaboración, adjuntos, notificaciones y sincronización. Se agregan en proyectos sin romper el contrato base.
