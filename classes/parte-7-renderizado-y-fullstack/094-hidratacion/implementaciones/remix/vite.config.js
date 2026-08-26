import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

/**
 * REMIX NO TIENE INTERRUPTOR DE HIDRATACIÓN POR RUTA, Y ES COHERENTE.
 *
 * De los cinco, es el único sin una forma declarativa de decir «esta pantalla no
 * se hidrata». Ni `client:*`, ni `"use client"`, ni `csr = false`, ni una tabla
 * de reglas.
 *
 * Lo único que hay es un `<Scripts />` en el documento raíz —ver `app/root.jsx`—
 * y quitarlo apaga la aplicación entera, no una pantalla. Su postura es la misma
 * de la clase 093: una sola forma de hacer las cosas, y ninguna decisión que
 * documentar.
 */
export default defineConfig({
  plugins: [remix({ future: { v3_singleFetch: true } })],
});
