# Por qué sí y por qué no — Probar sin base de datos

> [⬅️ Clase 065](README.md) · [📚 Parte 4](../README.md)

| Estrategia | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| **Doble en memoria** | Microsegundos, aislamiento total, ninguna herramienta que instalar | No sabe nada de lo que hace la base por ti | Un hueco con forma de esquema |
| **Base en memoria** | Motor de verdad, SQL de verdad, restricciones de verdad | **Es otro motor**: dialecto, tipos y concurrencia no coinciden | Fallos que solo salen en producción |
| **Base real** | Lo único que prueba lo que vas a desplegar | Lenta, hay que levantarla y limpiarla, y se comparte | Pruebas que la gente deja de ejecutar |

## 🧭 Cómo repartir

No hay porcentajes universales, y sí un criterio que funciona:

> **Prueba con un doble lo que escribiste tú. Prueba con un motor lo que
> declaraste en el esquema.**

Una regla de negocio la escribiste tú: doble. Un índice único, una clave ajena,
una cascada, un `DEFAULT`: los declaraste, y solo el motor sabe si funcionan.

La consecuencia práctica es que **las pruebas con motor no son «pruebas del ORM»
ni pruebas de más**: son las únicas que cubren la mitad de tu sistema que no está
escrita en tu lenguaje.

## 🧭 Lo que ha cambiado desde que esta discusión empezó

Durante años la elección era doble o H2, porque levantar PostgreSQL en cada
ejecución era impensable. Con contenedores desechables eso dejó de ser cierto, y
la tercera columna se ha vuelto mucho más barata de lo que era.

Sigue sin ser gratis —arrancar, esperar a que acepte conexiones, limpiar entre
casos— y por eso la pirámide no se invierte. Pero la excusa «no podemos probar
contra el motor real» ya casi nunca es cierta, y conviene revisarla si viene
heredada.

## 💡 Lo que hay que llevarse

Meszaros distingue entre lo que una prueba **verifica** y lo que meramente
**ejecuta** [@meszaros-xunit]. Un doble ejecuta tu código; no verifica tu
esquema. Y como el esquema es código que también se despliega, dejarlo sin
verificar es dejar la mitad del sistema sin cubrir.

Por eso la pregunta útil al escribir una prueba no es «¿va a pasar?», sino:

> **Si esto se rompiera, ¿esta prueba se enteraría?**

La cuarta prueba de esta clase se entera con la base y no se entera con el doble.
Saber exactamente dónde está esa línea —y no fingir que no existe— es lo único
que separa una suite que protege de una que tranquiliza.

## Fuentes

- [@meszaros-xunit] Meszaros, Gerard. *xUnit Test Patterns*. Addison-Wesley, 2007. ISBN 9780131495050 — <https://openlibrary.org/isbn/9780131495050>
- [@fowler-test-pyramid] Fowler, Martin. *The Practical Test Pyramid / TestPyramid*. martinfowler.com — <https://martinfowler.com/bliki/TestPyramid.html>
