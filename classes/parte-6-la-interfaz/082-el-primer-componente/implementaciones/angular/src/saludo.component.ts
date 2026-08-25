import { Component, Input } from "@angular/core";

/**
 * EL COMPONENTE. Una CLASE con un decorador encima.
 *
 * Angular es el único de los ocho donde el componente es una clase, y el único
 * donde hay que declararlo con metadatos: `selector` dice con qué etiqueta se
 * usa, `template` qué dibuja, y `standalone` que no necesita pertenecer a un
 * módulo.
 *
 * Ese `standalone: true` es historia reciente. Hasta Angular 14, todo componente
 * tenía que declararse en un `NgModule`, y esa ceremonia era la queja número uno
 * del framework. Hoy es el valor por omisión.
 *
 * `@Input()` marca lo que entra desde fuera. Es lo mismo que `props` en Vue o
 * `static properties` en Lit: la lista explícita de lo que el componente acepta.
 */
@Component({
  selector: "mi-saludo",
  standalone: true,
  template: `<h1 data-componente="saludo">{{ texto }}</h1>`,
})
export class SaludoComponent {
  @Input() texto = "Hola, mundo";
}
