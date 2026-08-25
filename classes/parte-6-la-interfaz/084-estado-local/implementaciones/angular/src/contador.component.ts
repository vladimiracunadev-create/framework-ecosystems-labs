import { Component, Input, signal } from "@angular/core";

import { siguiente } from "./reglas.js";

/**
 * EL ESTADO ES UNA SEÑAL, Y ESO ES NUEVO EN ANGULAR.
 *
 * Durante diez años el estado de un componente de Angular fue **un campo
 * normal**, y quien detectaba los cambios era Zone.js: una biblioteca que
 * parchea `setTimeout`, `addEventListener` y las peticiones de red para saber
 * cuándo volver a mirar el árbol entero.
 *
 * Funcionaba y era caro. Desde la versión 16, `signal()` hace lo que hacen las
 * demás desde el principio: avisar de que este dato concreto cambió.
 *
 * Se lee llamándola —`valor()`— igual que en Solid, y se escribe con `.set()` o
 * `.update()`. `@Input()` sigue siendo la entrada: aquí, el valor de partida.
 */
@Component({
  selector: "mi-contador",
  standalone: true,
  template: `<div [attr.data-instancia]="id" [attr.data-valor]="valor()">
    <span>{{ valor() }}</span>
    <button (click)="cambiar(1)">+1</button>
    <button (click)="cambiar(-1)">-1</button>
  </div>`,
})
export class ContadorComponent {
  @Input() id = "sola";

  @Input()
  set inicial(valor: number) {
    this.valor.set(siguiente(valor, 0));
  }

  valor = signal(0);

  cambiar(paso: number) {
    this.valor.update((actual) => siguiente(actual, paso));
  }
}
