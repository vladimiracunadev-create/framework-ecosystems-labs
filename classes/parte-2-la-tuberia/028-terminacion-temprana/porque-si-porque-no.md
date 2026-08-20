# Por qué sí y por qué no — Terminación temprana

> [⬅️ Clase 028](README.md) · [📚 Parte 2](../README.md)

Los cuatro cortan igual —responder sin continuar— así que la comparación no va de
sintaxis: va de **qué te dan para no acabar con una lista de excepciones dentro de
un `if`**.

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Con Spring Security, las reglas se declaran por patrón de ruta y por rol | Spring Security es una pieza grande con su propia curva | Configuración considerable antes de la primera regla |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Autorización por punto final: `RequireAuthorization()` en la ruta | Dos sistemas —capa y atributos— que hay que coordinar | Saber cuál actúa antes |
| [Express](../../../atlas/fichas/express.md) | Capas por montaje: `app.use("/privado", comprobar)` | Sin nada declarativo: la lista de rutas es código | Una lista que crece y donde se cuelan errores |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Dependencias por ruta o por enrutador: muy expresivo | La capa global no distingue rutas cómodamente | Elegir entre capa global o dependencia por ruta |

## 🧭 El eje real: lista blanca o lista negra

Esta clase implementa una **lista negra**: se comprueba todo salvo `/publico`. Es
lo correcto, y su punto débil es que la excepción vive dentro de la capa.

La alternativa —proteger solo lo que se marca— es más cómoda y **más peligrosa**:
la ruta nueva nace desprotegida, y nadie se entera hasta que alguien la
encuentra. OWASP sitúa exactamente ahí buena parte de los fallos de control de
acceso [@owasp-asvs].

De modo que el criterio para elegir entre las cuatro filas de arriba no es cuál
es más elegante, sino **cuál hace que lo seguro sea lo que pasa por omisión**:

- **Todo protegido salvo lo declarado** → correcto por construcción, y necesitas
  un buen mecanismo para declarar las excepciones. Ahí ganan Spring Security y la
  autorización de ASP.NET Core.
- **Solo lo marcado** → cómodo, y depende de que nadie se olvide. Es donde acaban
  los proyectos que empiezan con la capa global y un `if`.

## 💡 Y una ventaja que se olvida

Cortar pronto **ahorra trabajo**. La petición rechazada no consulta la base de
datos, no serializa y no llama a otro servicio. Con tráfico abusivo, esa
diferencia es lo que separa un servicio que aguanta de uno que se cae — el
argumento de contención de daño que Nygard desarrolla en detalle
[@nygard-release-it].

Por eso el orden de la clase 027 importa aquí: **la capa que rechaza debe ir
antes que la que cuesta**.

## Fuentes

- [@owasp-asvs] *OWASP Application Security Verification Standard*, OWASP Foundation — <https://owasp.org/www-project-application-security-verification-standard/>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
