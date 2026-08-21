# Por qué sí y por qué no — OAuth 2.0 y OpenID Connect

> [⬅️ Clase 069](README.md) · [📚 Parte 5](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `openid-client` está certificado por la OpenID Foundation: el cliente correcto son veinte líneas | Del lado servidor no hay nada oficial: o Keycloak, o un SaaS | Operar (o pagar) una pieza de infraestructura más |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `authlib` cubre cliente y servidor con la misma biblioteca | Nada de esto es del framework: la integración con `Depends` la escribes tú | Elegir bien entre bibliotecas que parecen equivalentes y no lo son |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | El único con servidor de autorización **oficial** (`spring-authorization-server`) y cliente integrado en Spring Security | La curva: filtros, `SecurityFilterChain` y convenciones antes de la primera redirección | Aprender Spring Security para tocar cualquier pieza del flujo |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `AddOpenIdConnect()` de serie: consumir un proveedor externo es configuración, no código | Servidor propio no hay: Duende es de pago desde IdentityServer4, y esa historia dolió al ecosistema | Presupuesto o dependencia comunitaria (OpenIddict) para el lado emisor |

## 🧭 Por qué las cuatro implementaciones son iguales

En casi todas las clases de este repositorio, cada framework resuelve el
problema a su manera. Aquí no: las cuatro implementaciones son la misma
lógica con distinta sintaxis, porque **el protocolo no deja margen** — qué
se valida, en qué orden y qué se responde está especificado [@rfc6749].

Esa rigidez es la lección: OAuth es valioso precisamente porque no admite
interpretaciones. La creatividad en un protocolo de seguridad es el fallo.
Y por eso mismo el consejo operativo es no implementarlo: toda la
creatividad que el protocolo prohíbe reaparece como bugs en las
implementaciones caseras.

## ⚖️ Cuándo delegar la identidad

- **Sí** cuando los usuarios ya tienen cuenta en otro sitio (empresa con
  directorio, público general con Google/Apple), cuando hay varios clientes
  (web + móvil + API) o cuando el requisito incluye MFA, recuperación y
  auditoría — todo eso viene con el proveedor.
- **No necesariamente** para una aplicación pequeña con sus propios
  usuarios: las clases 066 y 068 son un sistema completo y honesto. OAuth
  añade una pieza de infraestructura, otra superficie de fallo y una
  dependencia de terceros — y «entrar con Google» significa que Google
  puede cerrar la cuenta de tu usuario.

La trampa del medio: montar OAuth **contra tu propio y único backend** para
una sola aplicación web. Es pagar toda la complejidad del flujo para
obtener lo que una sesión con cookie ya daba.

## Fuentes

- [@rfc6749] *RFC 6749 — The OAuth 2.0 Authorization Framework*. IETF, 2012 — <https://www.rfc-editor.org/rfc/rfc6749>
- [@rfc9700] *RFC 9700 — Best Current Practice for OAuth 2.0 Security*. IETF, 2025 — <https://www.rfc-editor.org/rfc/rfc9700>
