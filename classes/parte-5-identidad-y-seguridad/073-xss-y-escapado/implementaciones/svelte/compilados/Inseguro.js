import * as $ from 'svelte/internal/server';

export default function Inseguro($$renderer, $$props) {
	// La puerta explícita: {@html} inyecta sin escapar. La documentación de
	// Svelte abre su descripción con la advertencia de XSS.
	let { texto } = $$props;

	$$renderer.push(`<div>${$.html(texto)}</div>`);
}