import * as $ from 'svelte/internal/server';

export default function Seguro($$renderer, $$props) {
	// La interpolación normal de Svelte: {texto} escapa por omisión.
	let { texto } = $$props;

	$$renderer.push(`<p>${$.escape(texto)}</p>`);
}