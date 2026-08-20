# 📦📱 Apache Cordova — 2009

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Cordova —conocido antes como PhoneGap— fue **el primer puente masivo entre la web
y el móvil**: empaquetar una aplicación web dentro de una vista de navegador
nativa y darle acceso al dispositivo mediante complementos.

Definió el debate «híbrido frente a nativo» que sigue vivo quince años después.

| | |
|---|---|
| **Aparición** | 2009 (como PhoneGap), donado a Apache en 2011 |
| **Clasificación** | `runtime-bridge` |
| **Ecosistema** | JavaScript |
| **Licencia** | `Apache-2.0` |
| **Gobierno** | Apache Software Foundation |
| **Estado** | 🟡 Mantenimiento |
| **Documentación** | <https://cordova.apache.org/docs/en/latest/> |

---

## 💡 La idea y su límite

Una vista de navegador a pantalla completa, más complementos que exponen cámara,
contactos o geolocalización al JavaScript. Un equipo web podía publicar una
aplicación móvil sin aprender dos plataformas nativas.

Su límite se hizo famoso: **las aplicaciones se notaban**. El desplazamiento, las
transiciones y la respuesta al tacto no eran los del sistema, y los navegadores
móviles de la época no ayudaban.

Ese es el compromiso que la
[ficha de Flutter](flutter.md) y la de [React Native](react-native.md) resuelven de
otras dos maneras: dibujar propio, o usar los componentes nativos. Cordova hacía
una tercera cosa —**mostrar una web**— y era la más barata y la que menos se
parecía a una aplicación.

## 🧬 Su descendencia

[Capacitor](capacitor.md) es su sucesor espiritual, con herramientas modernas y
mejor integración; [Ionic](ionic.md) aporta los componentes con aspecto nativo
que a Cordova le faltaban.

Y el debate que abrió sigue estructurando el
[módulo 09](../../curriculum/09-movil-escritorio-y-offline.md): la pregunta no es
«¿híbrido o nativo?» sino **qué capacidad del dispositivo necesitas, con qué
frecuencia actualizas y cuántas plataformas mantienes**.

## 🎓 Las dos lecciones

**1. Bajar la barrera de entrada cambia quién puede construir.** Cordova permitió
publicar aplicaciones móviles a miles de equipos web.

**2. La sensación de la interfaz es un requisito, no un detalle estético.** Fue lo
que limitó a Cordova y lo que motivó a sus sucesores.

## 🔗 Enlaces

- Documentación oficial: <https://cordova.apache.org/docs/en/latest/>
- [Ficha de Capacitor](capacitor.md) · [Ficha de Ionic](ionic.md) · [Ficha de React Native](react-native.md)
- [Módulo 09](../../curriculum/09-movil-escritorio-y-offline.md)

## Fuentes

- [@ater-pwa] Ater, Tal. *Building Progressive Web Apps*. O'Reilly Media, 2017. ISBN 9781491961650 — <https://openlibrary.org/isbn/9781491961650>
