# 🦀🖥️ Tauri — 2022

> [⬅️ Atlas](../README.md) · [🦀 Ecosistema Rust](../ecosistemas/rust.md) · [🗂️ Índice](../frameworks.md)

Tauri hace la pregunta que Electron dejó abierta: **si el sistema operativo ya
trae un motor web, ¿por qué empaquetar otro?** Su respuesta produce binarios de
unos pocos megabytes en lugar de cientos, y a cambio hereda las diferencias entre
los motores de cada plataforma.

> **🎯 Por qué está en este programa**
>
> Porque su modelo de permisos es **la mejor implementación del principio de menor
> privilegio** que hay en el catálogo ([módulo 07](../../curriculum/07-identidad-y-seguridad.md)).
> En Electron la seguridad es una lista de comprobaciones que puedes ignorar; en
> Tauri, cada capacidad que la interfaz puede invocar hay que **declararla
> explícitamente**, y lo no declarado no existe.

| | |
|---|---|
| **Aparición** | 2022 (versión 1.0) |
| **Clasificación** | `desktop-runtime` |
| **Ecosistema** | Rust (interfaz en tecnología web) |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://v2.tauri.app/> |

---

## 💡 La arquitectura

```
┌────────────────────────────────┐      ┌───────────────────────────┐
│  Núcleo en Rust                │      │  Interfaz web             │
│  Archivos, red, ventanas       │◄────►│  El motor DEL SISTEMA:    │
│  Cada capacidad, declarada     │ IPC  │  WebView2 · WKWebView ·   │
│                                │      │  WebKitGTK                │
└────────────────────────────────┘      └───────────────────────────┘
```

La interfaz es la misma que en Electron: HTML, CSS y el framework de JavaScript
que prefieras. Lo que cambia son las dos capas de debajo — el motor lo pone el
sistema y el proceso privilegiado está escrito en Rust.

## 🛡️ Permisos declarados, no confiados

Esta es su aportación real. En Tauri, la interfaz **no puede invocar nada que no
se haya declarado**, y la declaración vive en la configuración de la aplicación,
no en el código de la ventana [@tauri-security]:

```rust
// Comando: la única forma de que la interfaz pida algo al sistema.
// No expone "escribir archivos": expone "guardar una tarea".
#[tauri::command]
fn guardar_tarea(tarea: Tarea) -> Result<(), String> {
    // ... y aquí, validación en el límite, como en cualquier servidor
    Ok(())
}
```

Tres propiedades que el [módulo 07](../../curriculum/07-identidad-y-seguridad.md)
persigue y que aquí vienen impuestas por el diseño:

1. **Menor privilegio por omisión.** Lo que no se declara, no existe. En Electron
   hay que acordarse de desactivar cosas; aquí hay que acordarse de activarlas, y
   olvidarse es seguro.
2. **La superficie es auditable.** La lista de capacidades de la aplicación es un
   archivo que se puede leer y revisar en un cambio de código.
3. **El límite de confianza es explícito.** La interfaz se trata como no fiable —
   que es exactamente lo que es, porque puede sufrir una inyección.

## ⚖️ Lo que se paga

**1. El motor lo pone el sistema, con lo bueno y lo malo.** El binario es
pequeño porque no lo llevas dentro; a cambio, **la aplicación se comporta distinto
según la versión del motor** que tenga cada usuario. Es exactamente el problema
de compatibilidad que jQuery resolvió en la web en 2006, reaparecido en el
escritorio.

La defensa práctica es la misma que en la web moderna: apoyarse en capacidades
con soporte amplio y comprobado, en lugar de en lo último
[@web-baseline].

**2. Rust en el equipo.** El núcleo y los comandos son Rust. Para tareas simples
basta con poco; para integraciones nativas serias, hace falta saber Rust de
verdad. Es la dimensión de capacidades del equipo del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md).

**3. Menos recorrido demostrado.** Electron lleva más de una década en
aplicaciones enormes. Tauri es reciente. El módulo 11 no penaliza lo nuevo, pero
sí obliga a puntuar la **madurez demostrada** como una dimensión más.

## 🧭 La comparación completa

| | Electron | Tauri |
| --- | --- | --- |
| Motor web | Incrustado | Del sistema |
| Tamaño | Alto | Bajo |
| Consistencia entre plataformas | Total | Hereda diferencias |
| Seguridad por omisión | Hay que configurarla | Declarativa, cerrada por omisión |
| Lenguaje del proceso privilegiado | JavaScript (Node) | Rust |
| Madurez | Década | Reciente |

Ninguna gana. Un editor profesional que exige comportamiento idéntico en todas
partes tiene motivos para elegir Electron; una utilidad que debe ser ligera y con
superficie mínima tiene motivos para elegir Tauri.

## 🎓 Las tres lecciones

**1. Cerrado por omisión es mejor que abierto con lista de comprobaciones.** El
mismo objetivo de seguridad, con probabilidad de fallo muy distinta. Es un
principio de diseño aplicable mucho más allá del escritorio.

**2. No empaquetar el motor devuelve el problema de compatibilidad.** El
compromiso tamaño/consistencia no se puede evitar: solo elegir de qué lado
ponerse.

**3. La elección de lenguaje del núcleo es una decisión de equipo.** Rust aporta
garantías y exige personas que lo conozcan. Eso va en la matriz, no en la nota al
pie.

## 🔗 Enlaces

- Documentación oficial: <https://v2.tauri.app/>
- [Ficha de Electron](electron.md) — la otra columna
- [Ecosistema Rust](../ecosistemas/rust.md) · [Módulo 07](../../curriculum/07-identidad-y-seguridad.md)

## Fuentes

- [@tauri-security] *Tauri Security*, Tauri — <https://v2.tauri.app/security/>
- [@web-baseline] *Baseline*, Google — web.dev — <https://web.dev/baseline>
