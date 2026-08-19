# Seguridad y calidad

## Fronteras de confianza

Marca navegador, dispositivo, proxy, aplicación, proceso, base de datos, cola y servicio externo. Valida en la frontera que posee la regla y vuelve a autorizar al acceder al recurso.

## Controles transversales

- validación de forma, tamaño y semántica;
- errores estables sin detalles internos;
- parametrización de consultas;
- salida codificada según contexto;
- sesiones y cookies seguras;
- CSRF cuando existe autenticación por cookie;
- autorización por acción y recurso;
- límites, timeouts y cancelación;
- secretos externos y rotables;
- logs correlacionados sin datos sensibles;
- dependencias mínimas, bloqueadas y auditadas.

## Defaults del framework

Un mecanismo disponible no implica configuración segura. Documenta qué activa el framework, qué requiere opt-in y qué cambia detrás de un proxy o CDN.

## Calidad

Prioriza pruebas de reglas, contratos y riesgos. La cobertura porcentual es señal secundaria. Una prueba debe fallar ante el defecto que pretende detectar.

## IA generativa

Verifica APIs y versiones; revisa autorización, concurrencia y errores; ejecuta pruebas; no aceptes paquetes inventados; conserva trazabilidad de fuentes. El código generado recibe la misma revisión que el escrito manualmente.
