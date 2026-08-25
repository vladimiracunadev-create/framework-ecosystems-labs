import { Component, EventEmitter, Input, Output } from "@angular/core";

/**
 * EL HIJO. `@Input()` para lo que baja, `@Output()` para lo que sube.
 *
 * Angular es el único de los ocho donde las dos direcciones tienen **su propio
 * decorador**, y eso hace el contrato del componente legible de un vistazo: la
 * lista de entradas y la de salidas están una encima de la otra.
 *
 * `EventEmitter` es un objeto de RxJS por debajo. Suena a mucho para emitir un
 * número, y lo es — pero significa que la salida de un componente es un flujo
 * observable, con todo lo que RxJS trae detrás.
 *
 * La regla, otra vez: el hijo NO toca `valor`. Llama a `cambiar.emit(...)`.
 */
@Component({
  selector: "mi-contador",
  standalone: true,
  template: `<div data-hijo="contador" [attr.data-valor]="valor">
    <span>{{ valor }}</span>
    <button (click)="cambiar.emit(1)">+1</button>
    <button (click)="cambiar.emit(-1)">-1</button>
  </div>`,
})
export class ContadorComponent {
  @Input() valor = 0;
  @Output() cambiar = new EventEmitter<number>();
}
