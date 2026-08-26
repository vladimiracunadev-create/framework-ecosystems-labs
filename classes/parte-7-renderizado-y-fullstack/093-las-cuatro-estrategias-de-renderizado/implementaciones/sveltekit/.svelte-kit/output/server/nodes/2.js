import * as server from '../entries/pages/cliente/_page.server.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/cliente/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/cliente/+page.server.js";
export const imports = ["_app/immutable/nodes/2.DqfSNnvT.js","_app/immutable/chunks/B2LA58bN.js","_app/immutable/chunks/EuDlYfJe.js","_app/immutable/chunks/CSKszjpO.js","_app/immutable/chunks/Ck_unVqa.js","_app/immutable/chunks/DU_ddE4N.js"];
export const stylesheets = [];
export const fonts = [];
