# 📲🟦 NativeScript — 2014

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

NativeScript ofrece **acceso directo a las API nativas desde JavaScript**, sin la
capa de serialización que caracterizaba al puente de
[React Native](react-native.md).

| | |
|---|---|
| **Aparición** | 2014 |
| **Clasificación** | `ui-framework` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.nativescript.org/> |

---

## 💡 Llamar a lo nativo sin puente

```javascript
// Una clase nativa de iOS, invocada directamente desde JavaScript
const alerta = UIAlertController.alertControllerWithTitleMessagePreferredStyle(/* ... */);
```

El motor de JavaScript expone las clases del sistema por reflexión, sin capa de
mensajes intermedia. Eso elimina el coste de serialización que la
[ficha de React Native](react-native.md) describe como su punto débil original.

**El precio** es que ese código **no es portable**: usa las API de una plataforma
concreta. La lógica se comparte; los tramos que tocan el sistema, no — que es
exactamente el reparto por capas de la
[ficha de Compose Multiplatform](compose-multiplatform.md).

## ⚖️ Por qué no lideró

Ecosistema mucho menor que el de React Native o Flutter, y menos personas con
experiencia. Es el patrón repetido del Atlas —[MooTools](mootools.md),
[Aurelia](aurelia.md), [Mithril](mithril.md)—: **decisión técnica interesante,
red de apoyo insuficiente**.

Para el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) eso no lo
descalifica: lo sitúa. Un equipo que necesite acceso nativo profundo y esté
dispuesto a asumir un ecosistema pequeño tiene aquí un argumento real.

## 🎓 Las dos lecciones

**1. Eliminar el puente elimina su coste y su portabilidad.** El acceso directo
ata a la plataforma.

**2. Compartir lógica y compartir interfaz son decisiones separadas.** La primera
casi siempre compensa; la segunda depende del producto.

## 🔗 Enlaces

- Documentación oficial: <https://docs.nativescript.org/>
- [Ficha de React Native](react-native.md) · [Ficha de Capacitor](capacitor.md)
- [Módulo 09](../../curriculum/09-movil-escritorio-y-offline.md)

## Fuentes

- [@react-native-architecture] *React Native Architecture Overview*, Meta — React Native — <https://reactnative.dev/architecture/overview>
