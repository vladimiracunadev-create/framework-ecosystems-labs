import * as server from '../entries/pages/estatico/_page.server.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/estatico/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/estatico/+page.server.js";
export const imports = ["_app/immutable/nodes/3.DcaP3DE1.js","_app/immutable/chunks/B2LA58bN.js","_app/immutable/chunks/EuDlYfJe.js","_app/immutable/chunks/Ck_unVqa.js","_app/immutable/chunks/DU_ddE4N.js"];
export const stylesheets = [];
export const fonts = [];
