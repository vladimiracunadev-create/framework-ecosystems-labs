# Por qué sí y por qué no — Inyección de dependencias

> [⬅️ Clase 036](README.md) · [📚 Parte 2](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Inyección por constructor sin anotación; el contenedor más maduro que existe | El grafo es implícito: leer el controlador no dice qué se ejecuta | Errores de resolución con mensajes sobre el contenedor, no sobre tu código |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Contenedor en la plataforma y registro de una línea | Los tres ámbitos hay que entenderlos antes de elegir | Un ámbito mal elegido es un fallo sutil — clase 037 |
| [Laravel](../../../atlas/fichas/laravel.md) | Resuelve por tipo, y PHP conserva los tipos en ejecución | Los `facades` ofrecen el atajo global que anula la ventaja | La tentación de saltarse la inyección está a mano |
| [NestJS](../../../atlas/fichas/nestjs.md) | Trae a Node el modelo de Spring, con módulos y ámbitos | **Las interfaces se borran al compilar**: hace falta una ficha | Ceremonia extra en cada inyección por interfaz |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Sin contenedor: la dependencia se lee en la firma | Menos potente para grafos profundos | Nada, mientras el grafo sea plano |

## 🧭 ¿Hace falta un contenedor?

La respuesta honesta es **no siempre**, y FastAPI lo demuestra.

El beneficio real de todo esto es **poder sustituir una colaboración sin tocar
quien la usa** — para probar, para cambiar de proveedor, para simular un fallo.
Eso se obtiene pasando la dependencia como argumento. El contenedor añade otra
cosa: **resolver grafos profundos automáticamente**.

- **Grafo plano** —el manejador necesita dos o tres cosas construidas
  directamente— → el contenedor aporta poco y cuesta indirección.
- **Grafo profundo** —el manejador necesita un servicio que necesita un
  repositorio que necesita una conexión que necesita configuración— → construirlo
  a mano en cada sitio es insostenible, y el contenedor se paga solo.

Seemann y van Deursen lo plantean igual: la inyección es el patrón, el contenedor
es una herramienta opcional para aplicarlo a escala
[@seemann-deursen-di].

## ⚠️ El uso que anula la ventaja

**Inyectar el contenedor.** Un manejador que recibe el contenedor y le pide cosas
ha vuelto al punto de partida: vuelve a decidir sus dependencias, solo que ahora
de forma opaca y con un error en tiempo de ejecución en vez de en compilación.

La versión de Laravel de este error son los `facades`: `Reloj::ahora()` desde
cualquier sitio. Funciona, es cómodo, y **el código que lo usa deja de ser
sustituible** — lo que se nota el día que hay que probarlo.

La regla que distingue el uso correcto: **si al leer la firma sabes de qué depende
ese código, está bien inyectado**. Si hay que leer el cuerpo para averiguarlo, no.

## Fuentes

- [@seemann-deursen-di] Seemann, Mark; van Deursen, Steven. *Dependency Injection Principles, Practices, and Patterns*. Manning, 2019. ISBN 9781617294730 — <https://openlibrary.org/isbn/9781617294730>
