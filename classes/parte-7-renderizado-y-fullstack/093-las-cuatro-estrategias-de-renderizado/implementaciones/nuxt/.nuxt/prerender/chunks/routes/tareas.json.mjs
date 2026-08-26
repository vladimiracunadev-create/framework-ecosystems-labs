import { defineEventHandler } from 'file://C:/dev/framework-ecosystems-labs/classes/parte-7-renderizado-y-fullstack/093-las-cuatro-estrategias-de-renderizado/implementaciones/nuxt/node_modules/.pnpm/h3@1.15.11/node_modules/h3/dist/index.mjs';

const TAREAS = ["comprar pan", "regar las plantas", "llamar al taller"];

const tareas_json = defineEventHandler(() => ({ tareas: TAREAS }));

export { tareas_json as default };
//# sourceMappingURL=tareas.json.mjs.map
