# Por qué sí y por qué no — Cabeceras de seguridad

> [⬅️ Clase 035](README.md) · [📚 Parte 2](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Con Spring Security, **las cinco vienen puestas y bien** | Spring Security es una pieza grande con su curva | Configuración considerable antes de la primera regla |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Capa corta y clara; control total del valor | No trae ninguna por omisión | Escribirla y recordar que existe |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `setdefault` permite que una ruta afine su política | No trae ninguna | Igual |
| [Express](../../../atlas/fichas/express.md) | Bibliotecas muy conocidas lo resuelven en una línea | Ninguna por omisión, y **añade `x-powered-by`** | Una dependencia, o quitarlo a mano |

## 🧭 Lo que dicen los valores por omisión

Esta clase es la mejor prueba de algo que el
[módulo 11](../../../curriculum/11-seleccion-y-sostenibilidad.md) repite: **la
configuración inicial de un framework codifica las prioridades de quien lo
escribió**.

Spring Security asume que estás construyendo algo que hay que proteger y protege
por omisión, al precio de configuración. Express asume que sabes lo que haces y no
estorba, al precio de que un proyecto descuidado sale a producción sin ninguna de
las cinco.

**Ninguna de las dos posturas es incorrecta.** Lo incorrecto es no saber cuál te
tocó, porque la configuración inicial es la que se queda: nadie revisa a los seis
meses las cabeceras que nunca puso.

## 💡 Cómo adoptarlas sin romper nada

Cuatro de las cinco son inofensivas: se ponen y ya está.

La quinta, `content-security-policy`, **puede romper la aplicación**, y por eso
suele ser la que falta. El camino que funciona:

1. **Modo informe.** `content-security-policy-report-only` no bloquea nada y
   avisa de lo que habría bloqueado.
2. **Recoger unos días** de tráfico real. Aparecen recursos que nadie recordaba.
3. **Ajustar y activar.**

Es el mismo patrón de la clase 019 con las redirecciones permanentes: **cambiar de
forma reversible, medir, consolidar**. Aplicar de golpe una política que rompe
recursos legítimos garantiza que se desactive entera, y volver a intentarlo cuesta
mucho más que hacerlo bien la primera vez.

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series*, OWASP Foundation — <https://cheatsheetseries.owasp.org/>
