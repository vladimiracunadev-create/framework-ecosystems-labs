# ⚛️🖥️ Electron — 2013

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Electron es la razón por la que buena parte de las aplicaciones de escritorio que
usas a diario están hechas con tecnología web. Su decisión es simple y drástica:
**empaquetar un navegador completo junto a tu aplicación**, para que se ejecute
igual en Windows, macOS y Linux.

Es también el caso del Atlas donde **la seguridad no es una capa opcional sino la
condición de uso**, y conviene explicar por qué.

> **🎯 Por qué está en este programa**
>
> **Por el compromiso tamaño/compatibilidad** ([módulo 09](../../curriculum/09-movil-escritorio-y-offline.md)):
> Electron elimina de golpe las diferencias entre plataformas a cambio de un coste
> de recursos que hay que declarar.
>
> **Y por su modelo de seguridad**, que es un caso práctico del
> [módulo 07](../../curriculum/07-identidad-y-seguridad.md): cuando el contenido
> web tiene acceso al sistema de archivos, un fallo de guiones deja de ser un
> problema del navegador y pasa a ser un problema del ordenador.

| | |
|---|---|
| **Aparición** | 2013, creado en GitHub para su editor de texto |
| **Clasificación** | `desktop-runtime` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Gobierno** | OpenJS Foundation |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://www.electronjs.org/docs/latest/> |

---

## 💡 Dos procesos, una frontera

Electron ejecuta **dos tipos de proceso** y toda su arquitectura —y su seguridad—
gira en torno a esa separación [@kinney-electron]:

```
┌──────────────────────────┐        ┌──────────────────────────────┐
│  Proceso principal       │        │  Proceso de renderizado      │
│  Node.js completo        │◄──────►│  Una página web              │
│  Archivos, menús, red    │  IPC   │  Sin acceso al sistema       │
└──────────────────────────┘        └──────────────────────────────┘
```

El proceso principal tiene acceso al sistema. El de renderizado es una página web
y **no debería tenerlo**. Entre ambos hay comunicación explícita por mensajes.

```javascript
// preload.js — el único puente, y expone SOLO lo que decides
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // La página puede pedir "guardar una tarea", no "escribir en cualquier archivo".
  guardarTarea: (tarea) => ipcRenderer.invoke("tareas:guardar", tarea),
});
```

**Esa función es la lección entera.** El puente no expone `fs`: expone una
operación del dominio. Es el principio de menor privilegio del
[módulo 07](../../curriculum/07-identidad-y-seguridad.md) aplicado a una frontera
de proceso.

## 🛡️ Por qué la seguridad aquí es distinta

En un navegador, una inyección de guiones roba datos de la página. En una
aplicación Electron mal configurada, **la misma inyección puede leer y escribir
archivos del usuario**.

El proyecto publica una lista explícita de comprobaciones, y merece leerse como
lo que es: un modelo de amenazas ya hecho [@electron-security]. Las tres que más
importan:

| Control | Por qué |
| --- | --- |
| **Aislamiento de contextos activado** | Impide que la página alcance las API internas |
| **Integración de Node desactivada** en el renderizador | La página no debe poder leer archivos |
| **Cargar solo contenido propio y verificado** | Mostrar una web de terceros en una ventana con privilegios es dar acceso al sistema |

La tercera es la que más se incumple: incrustar contenido remoto en una ventana
de la aplicación es cómodo y convierte cualquier compromiso de ese servidor en un
compromiso del ordenador del usuario.

## ⚖️ El compromiso, con números y sin ellos

| | Electron | [Tauri](tauri.md) | Nativo ([Qt](../ecosistemas/nativo.md)) |
| --- | --- | --- | --- |
| Motor web | Incrustado, el mismo en todas partes | El del sistema | No aplica |
| Tamaño del artefacto | Alto | Bajo | Medio |
| Memoria en reposo | Alta | Menor | Menor |
| Diferencias entre plataformas | Ninguna | Las del motor de cada sistema | Las absorbe el framework |
| Personal necesario | Cualquier equipo web | Web más algo de Rust | Especialistas |
| Madurez demostrada | Una década, aplicaciones enormes | Reciente | Décadas |

**Ninguna columna gana.** Electron paga recursos y compra previsibilidad total:
la aplicación se comporta igual en todas partes porque el navegador es el mismo.
Para un equipo que ya es web y un producto que debe existir en tres sistemas, ese
intercambio suele ser bueno; para una utilidad pequeña que debe arrancar al
instante, no.

## 🎓 Las tres lecciones

**1. Incrustar el motor compra previsibilidad y vende recursos.** Es el mismo
compromiso que en móvil entre Flutter y React Native, con las columnas cambiadas.

**2. Una frontera de proceso es una frontera de confianza.** El puente debe
exponer **operaciones del dominio**, nunca capacidades del sistema. Ahí es donde
se decide si un fallo de la interfaz es un incidente o una anécdota.

**3. Traer la web al escritorio trae también su modelo de amenazas.** Todo lo del
módulo 07 sigue aplicando, con consecuencias mayores porque ya no hay caja de
arena del navegador entre el fallo y el usuario.

## 🔗 Enlaces

- Documentación oficial: <https://www.electronjs.org/docs/latest/>
- [Ficha de Tauri](tauri.md) — la alternativa ligera
- [Ecosistema JavaScript](../ecosistemas/javascript.md) · [Módulo 09](../../curriculum/09-movil-escritorio-y-offline.md)

## Fuentes

- [@kinney-electron] Kinney, Steve. *Electron in Action*. Manning Publications, 2018. ISBN 9781617294143 — <https://openlibrary.org/isbn/9781617294143>
- [@electron-security] *Electron Security*, OpenJS Foundation — Electron — <https://www.electronjs.org/docs/latest/tutorial/security>
