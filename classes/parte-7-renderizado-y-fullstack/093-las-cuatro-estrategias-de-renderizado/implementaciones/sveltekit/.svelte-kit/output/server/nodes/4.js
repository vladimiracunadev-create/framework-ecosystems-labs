import * as server from '../entries/pages/servidor/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/servidor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/servidor/+page.server.js";
export const imports = ["_app/immutable/nodes/4.DcaP3DE1.js","_app/immutable/chunks/B2LA58bN.js","_app/immutable/chunks/EuDlYfJe.js","_app/immutable/chunks/Ck_unVqa.js","_app/immutable/chunks/DU_ddE4N.js"];
export const stylesheets = [];
export const fonts = [];
