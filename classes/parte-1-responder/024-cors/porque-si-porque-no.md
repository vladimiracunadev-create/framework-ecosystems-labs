# Por qué sí y por qué no — CORS

> [⬅️ Clase 024](README.md) · [📚 Parte 1](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Políticas con nombre aplicables por ruta: lo público y lo privado se separan | Dos pasos (registrar y aplicar) fáciles de dejar a medias | Registrar sin aplicar no da error, solo no funciona |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Configuración por patrón de ruta, y anotación por controlador si se prefiere | Varias formas de configurarlo que pueden contradecirse | Averiguar cuál manda cuando hay dos |
| [Express](../../../atlas/fichas/express.md) | Función de origen: la lista blanca es código y se prueba | Biblioteca externa; `origin: true` refleja cualquier origen | Un valor cómodo que parece seguro y no lo es |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Declarativo y legible en una llamada | Configuración global: aplicar reglas distintas por ruta es incómodo | Montar varias aplicaciones o filtrar a mano |

## 🧭 La única regla que importa

**Enumera los orígenes. Siempre.**

Las tres formas de no hacerlo se parecen mucho y son la misma:

```javascript
origin: "*"        // comodín explícito
origin: true       // refleja el que venga
allow_origins=["*"] // igual
```

Las tres dicen «cualquier página web puede leer mis respuestas desde el navegador
de sus visitantes». Si tu API es pública y sin credenciales, es correcto y
deliberado. Si usa cookies de sesión, es un fallo grave — y el navegador lo
bloquea precisamente por eso cuando además pides credenciales.

## 🔍 Por qué se llega al comodín

Casi nunca por decisión: por agotamiento. El mensaje de error de CORS no dice qué
falta, la comprobación previa es invisible en las herramientas hasta que sabes
buscarla, y el comodín hace que el error desaparezca.

Por eso esta clase pone el mecanismo antes que la configuración. **Quien entiende
que la comprobación previa existe y por qué se dispara** configura CORS en cinco
minutos; quien no, acaba en el comodín.

Y conviene recordar el límite del mecanismo: **CORS no es autorización**. El
último caso del contrato lo demuestra — el servidor devuelve 200 y los datos
igual, solo que sin autorizar al navegador a entregarlos a esa página. Quien
protege el recurso es la autorización de la clase 071, no esta cabecera
[@owasp-top10].

## Fuentes

- [@owasp-top10] *OWASP Top 10*, OWASP Foundation — <https://owasp.org/www-project-top-ten/>
