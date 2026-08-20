# Por qué sí y por qué no — Servir archivos estáticos

> [⬅️ Clase 020](README.md) · [📚 Parte 1](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Una línea y funciona | **No emite `Cache-Control`**: la configuración por omisión es la lenta | Una capa intermedia propia para hacerlo bien |
| [Express](../../../atlas/fichas/express.md) | Opciones directas para caché, archivos ocultos e índice | Nada activado por omisión | Conocer las opciones que importan |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Archivos dentro del artefacto: despliegue de una pieza | Cambiar un logo exige recompilar y volver a desplegar | Ciclo de publicación más lento para contenido que no es código |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Proveedor conectable: disco, recursos incrustados o remoto sin tocar lo demás | La más verbosa de las cuatro | Ceremonia a cambio de flexibilidad |

## 🧭 La decisión que no es del framework

**En producción, probablemente no deberías servir estáticos desde aquí.** Un
servidor especializado o una red de distribución lo hace mejor: sirve desde más
cerca del usuario, comprime y cachea sin consumir tus recursos, y libera hilos de
tu aplicación para lo que solo ella puede hacer.

Lo que estas cuatro implementaciones resuelven bien es **desarrollo, pruebas y
despliegues pequeños**, que es la mayoría de los casos de este programa.

Y una advertencia de seguridad que vale para las cuatro: **exponer un directorio
es exponer todo lo que haya dentro, ahora y en el futuro**. La carpeta que hoy
tiene un logo puede tener mañana una copia de seguridad que alguien dejó ahí «un
momento». Por eso la opción de Express que más importa no es `maxAge` sino
`dotfiles: "deny"`, y por eso el reto de la clase es intentar servir un `.env`.

OWASP clasifica esta clase de exposición entre los fallos de configuración de
seguridad [@owasp-top10], y es de los pocos que se detectan con una sola
petición.

## Fuentes

- [@owasp-top10] *OWASP Top 10*, OWASP Foundation — <https://owasp.org/www-project-top-ten/>
