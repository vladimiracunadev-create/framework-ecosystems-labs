# 🎗️ Knockout — 2010

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Knockout es, probablemente, **la tecnología del Atlas cuya idea más se usa hoy y
cuyo nombre menos se recuerda**. En 2010 introdujo en el navegador los
**observables** y los **valores calculados**: exactamente el mecanismo que en
2023 volvió con el nombre de «señales» a Angular, Svelte, Solid y Vue.

> **🎯 Por qué está en este programa**
>
> Porque demuestra que **el campo redescubre sus propias ideas**. Quien estudie
> las señales de 2023 como una novedad estará aprendiendo la mitad; quien
> reconozca en ellas los observables de 2010 entenderá también por qué se
> abandonaron y por qué volvieron. Ese reconocimiento es el objetivo del
> [módulo 03](../../curriculum/03-frontend-componentes-y-estado.md).

| | |
|---|---|
| **Aparición** | 2010, creado por Steve Sanderson |
| **Clasificación** | `mvvm-library` |
| **Ecosistema** | JavaScript |
| **Licencia** | `MIT` |
| **Estado** | 🟡 Mantenimiento |
| **Documentación** | <https://knockoutjs.com/documentation/introduction.html> |

---

## 💡 La idea: el dato sabe quién lo lee

Un observable es un valor que **registra qué código lo leyó** y, al cambiar,
avisa exactamente a ese código y a nadie más [@knockout-observables]:

```javascript
function ModeloDeTareas() {
  this.tareas = ko.observableArray([]);

  // Un valor calculado: no se guarda, se declara CÓMO se obtiene.
  // Knockout descubre solo que depende de `tareas`, porque lo leyó al ejecutarse.
  this.pendientes = ko.computed(() => this.tareas().filter((t) => !t.done).length);
}
ko.applyBindings(new ModeloDeTareas());
```

```html
<!-- La plantilla es HTML normal con atributos de enlace -->
<p>Pendientes: <span data-bind="text: pendientes"></span></p>
<button data-bind="enable: pendientes() > 0">Completar una</button>
```

Ahí están, en 2010, dos ideas que hoy se enseñan como recientes:

1. **El estado derivado se declara, no se guarda.** `pendientes` no puede
   desincronizarse porque no existe como variable: es una fórmula. Es la regla que
   el módulo 03 formula como *si puede calcularse, no se guarda*.
2. **El seguimiento de dependencias es automático.** Nadie declara que
   `pendientes` depende de `tareas`: se descubre al ejecutar.

## 📜 Por qué se apagó — y por qué volvió

Knockout perdió terreno frente a React y AngularJS por razones que **no tenían
que ver con su modelo de reactividad**:

| Lo que le faltó | Lo que lo sustituyó |
| --- | --- |
| Un modelo de **componentes** para dividir una aplicación grande | React, Angular, Vue |
| **Enrutado**, datos y estructura de proyecto | Frameworks completos |
| Un ecosistema y patrocinio grandes | Meta, Google |
| Herramientas de diagnóstico | Extensiones de navegador de los grandes |

Fue una biblioteca con una gran idea y sin producto alrededor — el mismo destino
que Backbone, por causas distintas.

Y una década después, la idea volvió sola. Angular la incorporó bajo el nombre de
señales [@angular-signals], Svelte reescribió su reactividad sobre el mismo
principio [@svelte-runes], y Solid lo convirtió en el centro de su diseño
[@solid-reactivity]. La formulación es prácticamente la de 2010; lo que cambió es
que ahora vive **dentro** de un framework de componentes, que es justo lo que le
faltaba.

## ⚖️ El compromiso de las señales, ayer y hoy

Es el mismo entonces que ahora, y conviene tenerlo claro antes de elegir:

| | Señales / observables | Volver a ejecutar y comparar |
| --- | --- | --- |
| Al cambiar un dato | Se actualiza lo que lo leyó | Se re-ejecuta el componente y se compara |
| Coste | Crece con las dependencias reales | Crece con el árbol re-descrito |
| Modelo mental | Hay que entender el grafo de dependencias | «Se ejecuta todo otra vez» |
| Trampa característica | Leer un valor fuera del seguimiento y perder la dependencia | Re-renderizados que hay que memorizar |

Ninguno gana en abstracto. React eligió simplicidad de modelo; Knockout, Vue y
Solid eligieron precisión de actualización.

## 🎓 Las tres lecciones

**1. Una gran idea no basta sin producto alrededor.** Knockout tenía el mejor
modelo de reactividad de su época y perdió frente a frameworks con componentes,
enrutado y ecosistema.

**2. El campo redescubre.** Las señales de 2023 son los observables de 2010. Saber
eso ahorra tratar cada anuncio como una revolución.

**3. «Si puede calcularse, no se guarda» es anterior a todos los frameworks
actuales.** Es un principio de diseño de datos, no una característica de una
herramienta.

## 🔗 Enlaces

- Documentación oficial: <https://knockoutjs.com/documentation/introduction.html>
- [Ficha de Vue](vue.md) · [Ficha de Angular](angular.md) — donde la idea volvió
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)

## Fuentes

- [@knockout-observables] *Observables*, Knockout — <https://knockoutjs.com/documentation/observables.html>
- [@angular-signals] *Angular Signals*, Google — Angular — <https://angular.dev/guide/signals>
- [@svelte-runes] *Introducing runes*, Svelte — <https://svelte.dev/blog/runes>
- [@solid-reactivity] *Intro to Reactivity*, SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
