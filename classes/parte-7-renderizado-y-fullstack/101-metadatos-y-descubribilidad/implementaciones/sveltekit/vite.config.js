import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

/**
 * El complemento viene de `@sveltejs/kit/vite`, no de
 * `@sveltejs/vite-plugin-svelte`.
 *
 * Son dos cosas distintas y se confunden: el segundo compila componentes de
 * Svelte en cualquier proyecto de Vite; el primero es el que monta SvelteKit
 * entero —enrutado por directorios, `load`, adaptadores— y usa al segundo por
 * debajo.
 */
export default defineConfig({ plugins: [sveltekit()] });
