# Por qué sí y por qué no — Registro de peticiones

> [⬅️ Clase 029](README.md) · [📚 Parte 2](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Registro en la plataforma, con niveles y ámbitos, sin biblioteca | La configuración por omisión es ruidosa | Ajustar niveles antes de que sirva |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | SLF4J y el contexto de diagnóstico: el identificador viaja solo | Configuración en archivos aparte | Aprender el sistema de registro además del framework |
| [FastAPI](../../../atlas/fichas/fastapi.md) | El registro estándar de Python, maduro y muy configurable | No trae registro de peticiones puesto | Escribir la capa |
| [Express](../../../atlas/fichas/express.md) | Total libertad, y bibliotecas conocidas para no empezar de cero | No trae nada | Elegir biblioteca y formato en cada proyecto |

## 🧭 La decisión que importa no es el framework

Es **el formato**, y se toma una vez y se vive muchos años.

**Texto libre** se lee bien en una terminal y no se puede consultar. Cuando el
sistema crece, «¿cuántas peticiones tardaron más de un segundo la semana pasada?»
se convierte en una expresión regular frágil.

**Un objeto por línea** se lee peor y responde esa pregunta con un filtro. Es la
propiedad que Majors y sus coautores ponen en el centro de la observabilidad:
poder responder preguntas que no habías previsto [@majors-observability].

Los cuatro frameworks admiten las dos. **Ninguno decide por ti**, y cambiarlo con
seis meses de registros acumulados es un trabajo desagradable.

## 🔒 Y la parte que no es técnica

Un registro acaba en un sistema que mucha gente puede leer, se guarda durante
meses y se copia a otros sitios. Todo lo que metas ahí hereda esas tres
propiedades.

De ahí las tres reglas que valen para los cuatro:

1. **La plantilla de ruta, no la ruta.** `/usuarios/:id/token/:valor`, no el valor.
2. **Identificadores, no contenidos.** El identificador del usuario, no su
   correo.
3. **Nada de credenciales.** Ni en el cuerpo, ni en la cadena de consulta, ni en
   las cabeceras que registres.

Adkins y sus coautores tratan los registros como un activo que hay que proteger
igual que la base de datos [@adkins-building-secure-reliable] — porque para quien
ataca suelen ser más fáciles de leer y contienen casi lo mismo.

## Fuentes

- [@majors-observability] Majors, Charity; Fong-Jones, Liz; Miranda, George. *Observability Engineering*. O'Reilly Media, 2022. ISBN 9781492076445 — <https://openlibrary.org/isbn/9781492076445>
- [@adkins-building-secure-reliable] Adkins, Heather; Beyer, Betsy; Blankinship, Paul; Lewandowski, Piotr; Oprea, Ana; Stubblefield, Adam. *Building Secure and Reliable Systems*. O'Reilly Media, 2020. ISBN 9781492083122 — <https://openlibrary.org/isbn/9781492083122>
