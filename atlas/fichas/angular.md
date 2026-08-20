# 🅰️ Angular — 2016

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Angular es **el framework con la opinión arquitectónica más fuerte del ecosistema
JavaScript**, y el que menos se parece a sus vecinos. Donde React ofrece una
pieza y te deja montar el resto, Angular trae el producto entero: contenedor de
dependencias, enrutado, formularios, cliente HTTP, pruebas y herramientas de
línea de comandos.

Nació además de una decisión dolorosa —la ruptura con
[AngularJS](angularjs.md)— y buena parte de su diseño es la corrección explícita
de lo que allí no funcionó.

> **🎯 Por qué está en este programa**
>
> **Es el único framework de interfaz del catálogo con un contenedor de
> dependencias completo** ([módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)).
> Quien entiende el contenedor de Angular reconoce el de Spring, el de NestJS y el
> de ASP.NET Core: es el mismo patrón en cuatro ecosistemas.
>
> **Y es el contrapunto necesario a React** en el
> [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md): no es «Angular
> frente a React», es «Angular frente a React más ocho decisiones».

| | |
|---|---|
| **Aparición** | 2016 (Angular 2), reescritura de AngularJS |
| **Clasificación** | `web-framework` — completo |
| **Ecosistema** | TypeScript |
| **Licencia** | `MIT` |
| **Gobierno** | Google y colaboradores |
| **Estado** | 🟢 Activo, con versiones mayores semestrales |
| **Documentación** | <https://angular.dev/> |

---

## 📜 Qué corrigió de su antecesor

Cada decisión grande de Angular responde a un defecto concreto de AngularJS:

| Defecto de AngularJS | Corrección en Angular |
| --- | --- |
| El ciclo de comprobación recorría todo lo vigilado | Detección de cambios por componente, con estrategias explícitas |
| Flujo de datos en cualquier dirección | Entradas hacia abajo, eventos hacia arriba, por convención |
| Sin tipos: los errores aparecían en ejecución | **TypeScript obligatorio**, con comprobación en compilación |
| Módulos propios que no eran los del lenguaje | Módulos estándar del lenguaje más módulos del framework |
| Directivas con un contrato confuso | Componentes con ciclo de vida definido |

El resultado es un framework donde **el compilador atrapa lo que antes se
descubría en producción** [@wilken-angular-in-action], a cambio de una curva de
entrada notablemente más alta.

## 💡 El contenedor de dependencias, que es lo distintivo

```typescript
// El servicio declara qué necesita; no lo construye ni lo busca.
@Injectable({ providedIn: "root" })
export class ServicioDeTareas {
  constructor(private http: HttpClient, private reloj: Reloj) {}
}

// El componente declara qué necesita; tampoco lo construye.
@Component({ selector: "app-tareas", templateUrl: "./tareas.html" })
export class TareasComponent {
  constructor(private tareas: ServicioDeTareas) {}
}
```

Nadie escribe `new` en ninguna parte. El framework construye el grafo de objetos,
resuelve las colaboraciones y gestiona sus alcances — exactamente lo que hace
Spring en la JVM. Es lo que permite **sustituir una colaboración por un doble sin
tocar el componente**, y por eso el
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) trata la inyección
por constructor como la forma preferible.

El precio también es el de Spring: cuando algo no se resuelve, hay que entender
el sistema de proveedores y de alcances para saber por qué.

## 🔄 Señales: la vuelta de una idea de 2010

Angular incorporó **señales** —valores que registran quién los lee y avisan solo
a esos lectores cuando cambian [@angular-signals]—. Es el mismo mecanismo que
Knockout introdujo en 2010, que Vue popularizó en 2014 y que SolidJS llevó al
extremo en 2018.

Ese regreso es una de las tesis del [Atlas](../README.md#las-cinco-eras): las
ideas del campo **circulan**, y reconocerlas bajo nombres distintos es más útil
que aprender cada API por separado. Para Angular la consecuencia práctica es
grande: permite actualizar la vista sin recorrer el árbol de componentes, que era
la deuda estructural heredada del ciclo de comprobación.

## ⚖️ El compromiso, sin adornos

### Lo que se gana

**Uniformidad.** Dos proyectos Angular de empresas distintas se parecen. La
estructura, los nombres, la forma de probar y el flujo de trabajo vienen dados.
En organizaciones grandes con rotación, eso reduce costes reales.

**Nada que elegir.** Enrutado, formularios reactivos, cliente HTTP,
internacionalización y pruebas vienen en la caja y están mantenidos por el mismo
equipo. Cero decisiones de integración, cero árboles de dependencias paralelos.

### Lo que se paga

**1. La curva es la más alta del ecosistema.** Módulos, inyección, decoradores,
detección de cambios, formularios reactivos y programación reactiva de flujos son
conceptos que hay que aprender **antes** de ser productivo.

**2. Versiones mayores cada seis meses.** Con herramienta de actualización
automática y guías detalladas, pero es trabajo continuo. Quedarse tres versiones
atrás convierte la actualización en un proyecto.

**3. Sobra para lo pequeño.** Para un sitio de contenidos o un panel de tres
pantallas, la maquinaria no se amortiza. La decisión del módulo 11 depende de la
escala y de la vida esperada del producto, no de la calidad del framework.

## 🎓 Las tres lecciones

**1. Una opinión fuerte es una funcionalidad, no un defecto** — para el proyecto
adecuado. Elimina decisiones y uniformiza equipos. Para el proyecto equivocado es
lastre. El módulo 11 existe para distinguir un caso del otro.

**2. La inyección de dependencias no es propiedad del backend.** Angular
demuestra que el mismo patrón sirve en la interfaz, y quien lo entiende aquí lo
reconoce en Spring, NestJS y .NET.

**3. Un framework puede aprender de su propio fracaso.** Angular es AngularJS
corregido punto por punto. Lo caro no fue la corrección: fue no poder aplicarla
sin romper.

## 🔗 Enlaces

- Documentación oficial: <https://angular.dev/>
- [Ficha de AngularJS](angularjs.md) — la ruptura, contada desde el otro lado
- [Ficha de React](react.md) · [Ecosistema JavaScript](../ecosistemas/javascript.md)

## Fuentes

- [@wilken-angular-in-action] Wilken, Jeremy. *Angular in Action*. Manning Publications, 2018. ISBN 9781617293313 — <https://openlibrary.org/isbn/9781617293313>
- [@angular-signals] *Angular Signals*, Google — Angular — <https://angular.dev/guide/signals>
