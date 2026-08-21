# Por qué sí y por qué no — Auditoría

> [⬅️ Clase 076](README.md) · [📚 Parte 5](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Una función y una lista: se ve entero y no hay magia que depurar | El punto único depende de que cada escritura se acuerde de llamarlo | Disciplina como única garantía de completitud |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `Depends` puede inyectar el auditor y dejarlo en la firma de la ruta | Igual de saltable: una escritura que no lo declare no aparece en el registro | Lo mismo, con mejor sitio donde ponerlo |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Puede bajar la auditoría al ORM (`@EntityListeners`, Envers): ningún camino de escritura la esquiva | Esa magia es invisible en el código de negocio y sorprende a quien no la conoce | Depurar lo que ocurre sin que nadie lo escriba |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Interceptores de `SaveChanges`: el mismo poder con un punto de enganche explícito | Solo cubre lo que pasa por EF Core; el SQL directo sigue por debajo | Saber qué escrituras pasan por el ORM y cuáles no |

## 🧭 El hallazgo

La pregunta de esta clase no es «cómo escribo un registro» —eso son diez
líneas en los cuatro— sino **hasta dónde puede bajar el punto único**. Y ahí
el reparto vuelve al de la clase 070: los frameworks con ORM integrado
(Spring, ASP.NET) pueden anclar la auditoría a la capa de persistencia, donde
es imposible saltársela desde el código de aplicación; Express y FastAPI la
anclan en la capa de aplicación, y lo que baje por debajo no se ve.

El matiz honesto: ni siquiera el ancla del ORM es total. Una migración, un
script de mantenimiento o un `UPDATE` a mano en producción escriben sin pasar
por ninguna de las cuatro implementaciones. La auditoría de aplicación cubre
lo que hace la aplicación; el resto lo cubre la auditoría **del motor**, que
es otra herramienta y otra conversación.

## ⚖️ Auditoría no es registro de peticiones

Se confunden porque los dos escriben líneas, y son cosas distintas:

| | Registro de peticiones (029) | Auditoría (076) |
| --- | --- | --- |
| Para qué | depurar y operar | responder quién hizo qué |
| Quién lo lee | el equipo, hoy | seguridad, cumplimiento, meses después |
| Qué apunta | todo lo que pasa | **solo los cambios** |
| Retención | días | meses o años |
| Se puede perder | sí, es molesto | **no**, es el punto |

De ahí que la auditoría no herede la infraestructura del registro operativo:
distinta retención, distinta protección, distinto destino. Meterla en el
mismo flujo de logs es cómodo el primer día y caro el día que hay que buscar
[@owasp-asvs].

## Fuentes

- [@adkins-building-secure-reliable] Adkins, H. et al. *Building Secure and Reliable Systems*. O'Reilly Media, 2020. ISBN 9781492083122 — <https://openlibrary.org/isbn/9781492083122>
- [@owasp-asvs] *Application Security Verification Standard*. OWASP — <https://owasp.org/www-project-application-security-verification-standard/>
