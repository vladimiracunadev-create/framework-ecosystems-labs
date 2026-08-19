# Guía de selección de framework

## Preguntas previas

1. ¿Qué producto se construye y para quién?
2. ¿Qué atributos de calidad son prioritarios?
3. ¿Dónde se ejecutará y desplegará?
4. ¿Qué experiencia tiene el equipo?
5. ¿Qué integraciones y normas existen?
6. ¿Cuál es la vida esperada del producto?
7. ¿Quién actualizará y operará la solución?
8. ¿Cómo se migrará si el framework deja de servir?

## Prueba de concepto correcta

Implementa un fragmento vertical representativo: interfaz, validación, regla, persistencia, autorización, prueba, telemetría y despliegue. Un CRUD en memoria no revela el costo real.

## Matriz ponderada

Pondera antes de puntuar: adecuación al producto, seguridad, accesibilidad, arquitectura, testabilidad, observabilidad, rendimiento, equipo, ecosistema, soporte, licencia, actualización, despliegue y salida.

## Señales de alerta

- la decisión ya estaba tomada antes de definir criterios;
- el framework es usado como currículum, no como solución;
- demasiados plugins críticos;
- documentación solo comunitaria para una capacidad esencial;
- no se probó una actualización mayor;
- benchmark sin código o entorno;
- reescritura total presentada como única migración.
