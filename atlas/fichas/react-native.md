# 📱 React Native — 2015

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

React Native contesta a la misma pregunta que Flutter —cómo escribir una vez y
publicar en varias plataformas— con la respuesta opuesta: **usar los componentes
nativos reales del sistema**, y controlarlos desde JavaScript.

Esa decisión define todas sus virtudes y todos sus problemas, y su historia es la
de cómo se fue arreglando el punto débil que esa decisión creaba: **el puente**.

> **🎯 Por qué está en este programa**
>
> Porque es la columna opuesta a [Flutter](flutter.md) en el
> [módulo 09](../../curriculum/09-movil-escritorio-y-offline.md), y porque su
> evolución arquitectónica es un caso de estudio excelente: **el mismo producto,
> reescribiendo su núcleo, sin romper a sus usuarios**.

| | |
|---|---|
| **Aparición** | 2015, publicado por Facebook (hoy Meta) |
| **Clasificación** | `ui-framework` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://reactnative.dev/docs/getting-started> |

---

## 💡 La idea: componentes nativos, control desde JavaScript

```jsx
import { View, Text, FlatList } from "react-native";

// <View> no es un <div>: es un UIView en iOS y un ViewGroup en Android.
export function PanelTareas({ tareas }) {
  const pendientes = tareas.filter((t) => !t.done).length;
  return (
    <View>
      <Text>Pendientes: {pendientes}</Text>
      <FlatList data={tareas} renderItem={({ item }) => <Text>{item.title}</Text>} />
    </View>
  );
}
```

El mismo modelo mental de React —`vista = f(estado)`— y los componentes son
reales del sistema [@dabit-react-native]. Un desplazamiento se siente nativo
porque **es** nativo, y un componente nuevo del sistema aparece sin que el
framework lo reimplemente.

## 🌉 El puente, y por qué fue el problema

La arquitectura original separaba dos mundos: JavaScript por un lado, las vistas
nativas por otro, y entre ellos un **puente asíncrono que serializaba mensajes en
JSON** [@react-native-architecture].

Funcionaba, y tenía tres costes estructurales:

| Coste | Cómo se notaba |
| --- | --- |
| **Todo era asíncrono** | Medir un elemento y reaccionar en el mismo fotograma era imposible |
| **Serializar cuesta** | Listas largas y gestos continuos se volvían el punto débil |
| **Arranque lento** | Había que cargar el motor de JavaScript y todo el paquete antes de pintar |

Ese puente es exactamente lo que Flutter evita **al no tener dos mundos**: dibuja
él mismo. Es el compromiso central entre ambos enfoques.

## 🔄 La renovación de la arquitectura

En lugar de reescribir el producto con otro nombre —el camino de AngularJS— Meta
sustituyó el núcleo por dentro y mantuvo la API pública:

- **Interfaz de módulos tipada**: el contrato entre JavaScript y lo nativo se
  genera desde tipos, en lugar de mensajes sin comprobar.
- **Llamadas directas y síncronas** cuando hacen falta, en vez de pasar todo por
  el puente asíncrono.
- **Renderizador con árbol compartido**, que permite trabajo en varios hilos.
- **Carga perezosa de módulos**, que reduce el arranque.

Y sobre todo: **una convivencia larga entre la arquitectura antigua y la nueva**,
con migración gradual [@djirdeh-fullstack-react-native]. Es el patrón de la figura
estranguladora del [módulo 10](../../curriculum/10-modernizacion-y-migracion.md)
aplicado al interior de un framework, y merece leerse como tal.

## ⚖️ Lo que hay que declarar antes de elegirlo

**1. «Escribe una vez» no es «publica en todas partes».** Comparten lógica y
buena parte de la interfaz; las diferencias de plataforma siguen ahí y hay que
tratarlas. Prometer lo contrario es la fuente número uno de decepción con este
enfoque.

**2. Sigue haciendo falta conocimiento nativo.** Para capacidades que no expone
el framework, para depurar problemas de compilación y para publicar en las
tiendas. El equipo no puede ser solo de perfil web.

**3. La cadena de dependencias es larga.** Un proyecto típico arrastra decenas de
módulos nativos de terceros, cada uno con su mantenimiento y su compatibilidad
con la versión del framework. Es la dimensión de cadena de suministro del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md), y aquí pesa más
que en la web.

**4. Actualizar es trabajo real.** Las versiones mayores tocan configuración
nativa de ambas plataformas. Quedarse atrás acumula deuda que después bloquea
correcciones de seguridad.

## 🎓 Las tres lecciones

**1. Usar componentes nativos hereda gratis lo que el sistema mejore** —incluida
la accesibilidad— y a cambio obliga a mantener un puente que es el punto débil.

**2. Se puede reescribir el núcleo sin romper la API.** Meta cambió la
arquitectura entera manteniendo la compatibilidad y ofreciendo convivencia. Es lo
contrario del caso AngularJS, con un problema técnico de dificultad comparable.

**3. Multiplataforma reduce el coste; no lo elimina.** Sigue habiendo dos
plataformas, dos tiendas, dos conjuntos de errores. La matriz del módulo 11 debe
contar ese coste residual, no suponer que es cero.

## 🔗 Enlaces

- Documentación oficial: <https://reactnative.dev/docs/getting-started>
- [Ficha de Flutter](flutter.md) — la otra columna · [Ficha de React](react.md)
- [Módulo 09](../../curriculum/09-movil-escritorio-y-offline.md)

## Fuentes

- [@dabit-react-native] Dabit, Nader. *React Native in Action*. Manning Publications, 2019. ISBN 9781617294051 — <https://openlibrary.org/isbn/9781617294051>
- [@djirdeh-fullstack-react-native] Djirdeh, Houssein; Accomazzo, Anthony; Grieco, Sophia. *Fullstack React Native*. Independently published, 2019. ISBN 9781728995557 — <https://openlibrary.org/isbn/9781728995557>
- [@react-native-architecture] *React Native Architecture Overview*, Meta — React Native — <https://reactnative.dev/architecture/overview>
