# 🧱 ASP.NET Web Forms — 2002

> [⬅️ Atlas](../README.md) · [🟦 Ecosistema .NET](../ecosistemas/dotnet.md) · [🗂️ Índice](../frameworks.md)

Web Forms está en el Atlas porque es **el argumento histórico exacto por el que
este programa enseña HTTP antes que ningún framework**. Ninguna otra tecnología
del catálogo ocultó el protocolo con tanto éxito, y ninguna dejó una lección tan
clara sobre lo que cuesta esconder aquello sobre lo que se construye.

> **🎯 Por qué está en este programa**
>
> Porque el [módulo 01](../../curriculum/01-http-eventos-y-contratos.md) empieza
> sin framework alguno, y esa decisión necesita justificación. Web Forms la
> proporciona: una generación entera de profesionales construyó aplicaciones web
> durante años **sin llegar a aprender qué es un verbo HTTP, un código de estado
> o una petición sin estado**, porque el framework se lo hizo innecesario.
>
> Y porque su migración es, junto con la de AngularJS, uno de los dos grandes
> casos documentados del [módulo 10](../../curriculum/10-modernizacion-y-migracion.md).

| | |
|---|---|
| **Aparición** | 2002, con la primera versión de .NET Framework |
| **Clasificación** | `component-framework` — componentes con estado en servidor |
| **Ecosistema** | .NET Framework (solo Windows) |
| **Licencia** | `NOASSERTION` — parte del .NET Framework propietario de la época |
| **Estado** | ⚪ Histórico. No se elige para empezar; sigue en producción en muchísimos sitios |
| **Documentación** | <https://learn.microsoft.com/aspnet/web-forms/> |

---

## 📜 El problema que resolvía

En 2002, quien programaba aplicaciones de escritorio en Windows tenía una
experiencia muy productiva: arrastrar un botón a un formulario, hacer doble clic
y escribir el código del evento `Click`. La web, en cambio, exigía entender
peticiones, respuestas, formularios HTML y un protocolo que **no recuerda nada
entre una petición y la siguiente**.

Microsoft tenía millones de programadores de escritorio y una decisión de
producto evidente: **hacer que la web se pareciera al escritorio**.

```aspx
<%-- La página declara controles, no marcado --%>
<asp:TextBox ID="txtNombre" runat="server" />
<asp:Button ID="btnGuardar" runat="server" Text="Guardar" OnClick="btnGuardar_Click" />
<asp:Label ID="lblMensaje" runat="server" />
```

```csharp
// Y el código responde a eventos, exactamente igual que en el escritorio
protected void btnGuardar_Click(object sender, EventArgs e) {
    lblMensaje.Text = "Hola, " + txtNombre.Text;   // el control "recuerda" su valor
}
```

Funcionó. Fue enormemente productivo y se adoptó a una escala difícil de
exagerar.

## 🎩 Cómo se hacía la magia: el estado de vista

Para que un control «recordara» su valor entre peticiones sobre un protocolo que
no recuerda nada, Web Forms serializaba el estado de la página **en un campo
oculto** que viajaba con cada envío:

```html
<input type="hidden" name="__VIEWSTATE" value="/wEPDwUKMTU4Mzk4MjAwNg9kFgICAw9kFgICAQ8P..." />
```

Ese campo podía alcanzar cientos de kilobytes en páginas con tablas grandes. Y
como cada interacción era un envío completo del formulario, **cada clic
significaba enviar todo eso de vuelta al servidor** y recibir la página entera.

Las consecuencias, todas conocidas y ninguna evidente desde el código:

| Síntoma | Causa real |
| --- | --- |
| Páginas lentas con conexiones modestas | El estado de vista viajaba en ambos sentidos |
| Prácticamente todo era `POST` | Los eventos se implementaban como envíos del formulario |
| No se podía enlazar a un estado concreto | La URL no representaba lo que se estaba viendo |
| Difícil de cachear | Casi nada era `GET` ni idempotente |
| Complicado de probar | El ciclo de vida de la página tenía más de una docena de etapas |
| Riesgo de seguridad | Un estado de vista sin firmar es manipulable por el cliente |

## 💥 La abstracción que se rompió

Web Forms es el ejemplo perfecto de una **abstracción que oculta algo con lo que
tarde o temprano hay que hablar**. Mientras todo iba bien, el modelo funcionaba.
Cuando algo fallaba —rendimiento, un botón que no disparaba su evento, un
comportamiento raro tras un despliegue— el diagnóstico exigía entender
exactamente lo que la abstracción había ocultado: qué petición se envió, con qué
método, qué contenía el estado, en qué etapa del ciclo se perdió.

Y ahí aparecía el problema de fondo: **el modelo mental que Web Forms enseñaba
no servía para depurar Web Forms.**

Es lo que el [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)
formula como regla general: *cuanto más implícito es el comportamiento, mejor
debe ser el diagnóstico*. Aquí lo implícito era el protocolo entero.

## 🔄 El relevo, y una migración de veinte años

Microsoft cambió de dirección en dos pasos:

**2009 · ASP.NET MVC.** Rutas, verbos, vistas sin estado, control del marcado
generado. La corrección explícita: adoptar el modelo que el resto del campo ya
usaba.

**2016 · ASP.NET Core.** Reescritura multiplataforma y de código abierto, con
middleware e inyección de dependencias propios [@freeman-pro-aspnet-core]. Web
Forms **no se portó**: es la única pieza grande que quedó atrás en .NET Framework.

Esa decisión dejó a miles de organizaciones ante la elección del
[módulo 10](../../curriculum/10-modernizacion-y-migracion.md): reescritura
completa o migración incremental. Microsoft publicó una guía específica que
compara el modelo de componentes de Web Forms con el de Blazor, precisamente
porque es el puente conceptual más corto para quien viene de ahí
[@blazor-webforms].

La ironía es fina: **Blazor recupera el modelo de componentes con estado que Web
Forms proponía**, pero esta vez con el estado explícito, sin campo oculto gigante
y con la opción de ejecutarse en el navegador. La idea no era mala; la
implementación de 2002 sí tenía un coste que la de 2018 no tiene.

## 🎓 Las cuatro lecciones

**1. Una abstracción se juzga por cómo falla, no por cómo funciona.** Web Forms
era excelente mientras todo iba bien. La pregunta antes de adoptar cualquier
magia es: *¿qué me va a decir cuando falle?*

**2. Ocultar el protocolo tiene un techo.** Por eso el
[módulo 01](../../curriculum/01-http-eventos-y-contratos.md) empieza sin
framework: la semántica de HTTP es la parte que no caduca, y no aprenderla se
paga en el primer diagnóstico difícil.

**3. Las tecnologías históricas siguen ejecutándose.** Hay muchísimo software
crítico en Web Forms hoy mismo. «Histórico» significa *no se elige para empezar*,
no *está apagado* — y ese es el terreno del módulo 10.

**4. Una idea puede volver corregida.** Los componentes con estado en servidor
regresaron en Blazor, en LiveView y en los componentes de servidor de React. Lo
que fracasó no fue la idea: fue el mecanismo de 2002.

## 🔗 Enlaces

- Documentación oficial: <https://learn.microsoft.com/aspnet/web-forms/>
- [Ecosistema .NET](../ecosistemas/dotnet.md) · [Ficha de AngularJS](angularjs.md) — el otro gran caso de migración
- [Módulo 01](../../curriculum/01-http-eventos-y-contratos.md) — por qué el protocolo va primero

## Fuentes

- [@freeman-pro-aspnet-core] Freeman, Adam. *Pro ASP.NET Core 7*. Manning Publications, 2023. ISBN 9781633437821 — <https://openlibrary.org/isbn/9781633437821>
- [@blazor-webforms] *Blazor for ASP.NET Web Forms Developers*, Microsoft — <https://learn.microsoft.com/dotnet/architecture/blazor-for-web-forms-developers/>
