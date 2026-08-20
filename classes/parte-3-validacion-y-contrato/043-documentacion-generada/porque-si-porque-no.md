# Por qué sí y por qué no — Documentación generada

> [⬅️ Clase 043](README.md) · [📚 Parte 3](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Documento derivado del modelo, con interfaz de prueba incluida | Los códigos de error hay que declararlos uno a uno | Ruido en el decorador |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | springdoc lee tipos y validaciones; muy completo | Otra dependencia con su versión que vigilar | Una pieza más en el árbol |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Generador **en la plataforma** desde .NET 9 | Más joven que las alternativas | Casos raros aún sin cubrir |
| [Express](../../../atlas/fichas/express.md) | Control total del documento | **Escrito a mano**: puede mentir | Sincronizarlo con el código, para siempre |

## 🧭 Lo que la generación no puede hacer

**Leer la lógica.** El 404 que vive dentro de un `if` no aparece en ningún
documento salvo que lo declares.

Eso deja una zona intermedia incómoda: el documento es correcto en lo que declara
e **incompleto en lo que no**. Un cliente que se fía de él y no maneja el 404
escribe código que falla el día que un identificador no existe.

De ahí que el contrato de esta clase ejecute los cuatro códigos declarados: es la
única forma de que el documento sea una promesa y no una descripción parcial.

## 💡 Y una advertencia sobre publicar

El documento generado **describe tu API entera**, incluidas las rutas internas que
no querías enseñar.

Publicarlo tal cual en producción es una decisión, no un valor por omisión: le da
a cualquiera el mapa completo de tu superficie expuesta. Adkins y sus coautores lo
tratan como parte de reducir esa superficie [@adkins-building-secure-reliable].

Las opciones razonables: publicar solo la parte pública, exigir autenticación para
verlo, o servirlo únicamente en entornos internos.

## Fuentes

- [@adkins-building-secure-reliable] Adkins, Heather; Beyer, Betsy; Blankinship, Paul; Lewandowski, Piotr; Oprea, Ana; Stubblefield, Adam. *Building Secure and Reliable Systems*. O'Reilly Media, 2020. ISBN 9781492083122 — <https://openlibrary.org/isbn/9781492083122>
