# 🔥🟦 Blazor — 2018

> [⬅️ Atlas](../README.md) · [🟦 Ecosistema .NET](../ecosistemas/dotnet.md) · [🗂️ Índice](../frameworks.md)

Blazor permite escribir componentes de interfaz en C# y ejecutarlos **en el
navegador con WebAssembly o en el servidor**, con el mismo código. Esa dualidad
lo convierte en el mejor banco de pruebas del catálogo para el
[módulo 04](../../curriculum/04-fullstack-y-renderizado.md): **el mismo componente,
dos lugares de ejecución**.

| | |
|---|---|
| **Aparición** | 2018 |
| **Clasificación** | `component-framework` |
| **Ecosistema** | .NET (C#) |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://learn.microsoft.com/aspnet/core/blazor/> |

---

## 🎭 Dos modelos, un código

| | **WebAssembly** | **Servidor** |
| --- | --- | --- |
| Dónde se ejecuta | Navegador | Servidor |
| Descarga inicial | El runtime .NET: grande | Mínima |
| Latencia de interacción | Nula: es local | Un viaje de red por interacción |
| Funciona sin conexión | Sí | No |
| Estado por usuario en servidor | No | **Sí, una conexión abierta** |
| Acceso directo a la base de datos | No | Sí |

La columna de servidor **es exactamente el modelo de
[Phoenix LiveView](phoenix-liveview.md)**: estado en el servidor, diferencias por
una conexión persistente. Y arrastra su misma restricción —una conexión con
estado por usuario— sin la máquina virtual que la hace barata, lo que limita
cuánto escala.

Poder comparar ambos modelos con el mismo código es una oportunidad didáctica
poco frecuente [@blazor-webforms], [@webassembly-org].

## 🧬 La idea que vuelve, corregida

Blazor recupera el modelo de componentes con estado en servidor de
[Web Forms](aspnet-webforms.md), y la comparación es instructiva:

| | Web Forms (2002) | Blazor servidor (2018) |
| --- | --- | --- |
| Transporte del estado | Campo oculto gigante en cada envío | Conexión persistente, solo diferencias |
| Modelo de programación | Eventos sobre controles | Componentes declarativos |
| Ciclo de vida | Muchas fases implícitas | Explícito |
| Relación con HTTP | Oculta | Visible |

**La idea no era mala; el mecanismo de 2002 sí tenía un coste que el de 2018 no
tiene.** Es una de las conclusiones que el [Atlas](../README.md) repite: las ideas
vuelven, corregidas por lo que se aprendió.

## ⚖️ Lo que hay que declarar

**1. El tamaño inicial en WebAssembly.** Descargar un runtime completo es un coste
real que hay que medir con red limitada, como exige el módulo 04.

**2. Cruzar hacia el documento tiene coste.** El mismo problema que describe la
[ficha de Yew](yew.md): WebAssembly no toca el DOM directamente.

**3. El modo servidor cambia la operación.** Conexión con estado significa
afinidad de sesión y reinicios no transparentes — requisitos del
[módulo 12](../../curriculum/12-producto-final.md).

## 🎓 Las dos lecciones

**1. El mismo componente en dos lugares de ejecución hace visible el
compromiso.** Es un laboratorio de renderizado dentro de un solo framework.

**2. Una idea descartada puede volver cuando cambia su mecanismo.** El estado en
servidor era inviable con campos ocultos y es viable con una conexión persistente.

## 🔗 Enlaces

- Documentación oficial: <https://learn.microsoft.com/aspnet/core/blazor/>
- [Ficha de ASP.NET Web Forms](aspnet-webforms.md) · [Ficha de Phoenix LiveView](phoenix-liveview.md) · [Ficha de Yew](yew.md)
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md)

## Fuentes

- [@blazor-webforms] *Blazor for ASP.NET Web Forms Developers*, Microsoft — <https://learn.microsoft.com/dotnet/architecture/blazor-for-web-forms-developers/>
- [@webassembly-org] *WebAssembly*, W3C — <https://webassembly.org/>
