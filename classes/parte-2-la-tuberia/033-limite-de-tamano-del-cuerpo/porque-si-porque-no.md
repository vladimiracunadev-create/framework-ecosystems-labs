# Por qué sí y por qué no — Límite de tamaño del cuerpo

> [⬅️ Clase 033](README.md) · [📚 Parte 2](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | El límite vive en Kestrel: **por debajo de tu código**, imposible de olvidar | Traducir la excepción a 413 con tu formato es cosa tuya | Un `catch` en el manejador |
| [Express](../../../atlas/fichas/express.md) | Una opción junto al analizador, a la vista de quien lee | Sin manejador de errores, el 413 sale con el formato ajeno | Recordar el manejador |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Control total de las dos comprobaciones | **No trae límite**: si no lo escribes, no existe | Más código, y la posibilidad de olvidarlo |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Límite de multipart por configuración, sin código | **No cubre cuerpos JSON**, y eso engaña | Creerse protegido por el ajuste que no aplica |

## 🧭 La pregunta que ordena la tabla

**¿Qué pasa si a quien escribe el manejador se le olvida?**

- **ASP.NET Core**: no pasa nada. Kestrel corta igual.
- **Express**: el analizador corta igual; solo el formato del error se resiente.
- **FastAPI y Spring**: no hay límite. La petición de 500 MB entra.

Esa es la diferencia entre una defensa **estructural** y una defensa **por
disciplina**. Las dos funcionan mientras nadie se equivoca; solo una sigue
funcionando cuando alguien se equivoca.

## ⚠️ El hueco de Spring, con nombre y apellidos

`spring.servlet.multipart.max-file-size` **existe y funciona** — la clase 021 lo
usa. Y no aplica a un `POST` con cuerpo JSON.

Ese detalle es peligroso justo porque el ajuste de multipart sí existe: un equipo
lo configura, ve que funciona con archivos y **da por hecho que hay un límite
general**. No lo hay.

La respuesta correcta en un despliegue real es poner el tope en el servidor de
entrada, donde cubre todo por igual. Es la misma conclusión de la clase 020 sobre
los estáticos: **hay defensas que están mejor fuera de la aplicación**.

## 💡 Y por qué es un límite y no una validación

Un cuerpo enorme no es un dato inválido: es un **consumo de recursos**. Se
rechaza por lo que cuesta procesarlo, no por lo que dice.

Por eso vive en la tubería junto a los plazos y los cupos, y no en la validación
de la clase 039. La distinción tiene una consecuencia práctica: **el límite se
aplica antes de saber si el contenido es correcto**, porque averiguarlo ya sería
el gasto que se quiere evitar.

## Fuentes

- [@owasp-asvs] *OWASP Application Security Verification Standard*, OWASP Foundation — <https://owasp.org/www-project-application-security-verification-standard/>
