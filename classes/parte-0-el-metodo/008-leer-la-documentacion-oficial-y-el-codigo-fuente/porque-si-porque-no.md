# Por qué sí y por qué no — Leer la documentación oficial y el código fuente

> [⬅️ Clase 008](README.md) · [📚 Parte 0](../README.md)

La pregunta de esta tabla es qué te deja consultar cada ecosistema **sin salir de
tu máquina**.

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | El paquete trae el código, el manifiesto trae la documentación y `require.resolve` da la ruta exacta | Un rango de versiones significa que lo instalado casi nunca es lo declarado | Tener que preguntar por la versión real cada vez que algo se rompe |
| [FastAPI](../../../atlas/fichas/fastapi.md) | El código está en disco y además `inspect.getsource` lo entrega desde dentro del intérprete | El entorno es compartido: `requirements.txt` describe un deseo, no un hecho | Que el archivo y la máquina digan cosas distintas sin que nada avise |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | El framework publica su propia versión y la JVM sabe de qué archivo cargó cada clase | Lo que viaja es bytecode: el original hay que pedirlo aparte | Un paso más entre la duda y la respuesta, que se nota en cuánto se consulta |

## 🧭 Lo que este contrato no puede probar

- **Que la documentación oficial sea buena.** Comprueba que el paquete diga
  dónde está, no lo que hay al llegar. Hay documentación oficial escasa y hay
  tutoriales excelentes; lo que la clase defiende es el **orden**, no la calidad.
- **Que el código fuente sea legible.** Que esté en tu disco no significa que se
  entienda a la primera. Significa que la pregunta tiene respuesta sin depender
  de nadie.
- **Que la reflexión sustituya a leer el código.** No lo hace: la forma de una
  clase no dice qué hace. Dice qué acepta y qué devuelve, que ya es más de lo
  que se puede adivinar.
- **Cuánta gente lo hace.** La clase demuestra que se puede, no que se haga.

## 💡 Lo que hay que llevarse

Hay tres fuentes para cualquier duda sobre un framework, y están ordenadas:

1. **El código instalado.** Es lo que se ejecuta. No puede estar desactualizado
   respecto a sí mismo.
2. **La documentación de esa versión exacta.** Enlazada desde el propio paquete
   en dos de los tres ecosistemas de esta clase.
3. **Todo lo demás** — tutoriales, respuestas de foros, artículos. Útil para
   entender el porqué, nunca para confirmar el qué.

Casi todo el mundo empieza por la tercera, y no por pereza: porque la tercera
está indexada y las dos primeras no. El buscador optimiza para lo que se enlaza,
no para lo que es cierto.

La consecuencia práctica cabe en un hábito: **antes de buscar, comprueba qué
versión tienes**. Los tres frameworks de esta clase contestan a eso con un
comando, y la respuesta descarta de golpe la mitad de los resultados que ibas a
leer.

Ousterhout lo dice del diseño y vale igual para la consulta: los sistemas se
entienden **desde dentro**, y cada capa de intermediarios entre tú y el original
añade una oportunidad de que la explicación sea de otra cosa
[@ousterhout-philosophy].

## Fuentes

- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*, 2.ª ed. Yaknyam Press, 2021. ISBN 9781732102217 — <https://openlibrary.org/isbn/9781732102217>
- [@semver] Preston-Werner, Tom. *Semantic Versioning 2.0.0* — <https://semver.org/>
- [@python-packaging] *Python Packaging User Guide*. Python Packaging Authority — <https://packaging.python.org/>
