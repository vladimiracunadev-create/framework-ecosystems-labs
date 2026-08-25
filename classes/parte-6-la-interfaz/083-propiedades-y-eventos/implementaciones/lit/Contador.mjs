import { LitElement, html } from "lit";

/**
 * EL HIJO. Recibe por atributo y avisa con un EVENTO DEL NAVEGADOR.
 *
 * Aquí está la diferencia grande de Lit con los otros siete: el canal de subida
 * no lo inventa el framework, **ya existe**. `CustomEvent` y `dispatchEvent` son
 * del estándar del DOM desde siempre, y el padre lo escucha con
 * `addEventListener` como escucharía un clic.
 *
 * Eso tiene dos consecuencias reales:
 *
 *   - el evento BURBUJEA si se lo pides (`bubbles: true`), como cualquier evento
 *     nativo, así que puede escucharlo un ancestro lejano — para bien y para mal;
 *   - `composed: true` hace falta para que atraviese el DOM en la sombra, y
 *     olvidarlo es uno de los fallos clásicos de los componentes web.
 */
export class Contador extends LitElement {
  static properties = {
    valor: { type: Number },
  };

  createRenderRoot() {
    return this;
  }

  avisar(paso) {
    // El hijo NO cambia `this.valor`. Emite y se olvida.
    this.dispatchEvent(
      new CustomEvent("cambiar", { detail: paso, bubbles: true, composed: true }),
    );
  }

  render() {
    return html`<div data-hijo="contador" data-valor=${this.valor ?? 0}>
      <span>${this.valor ?? 0}</span>
      <button @click=${() => this.avisar(1)}>+1</button>
      <button @click=${() => this.avisar(-1)}>-1</button>
    </div>`;
  }
}

customElements.define("mi-contador", Contador);
