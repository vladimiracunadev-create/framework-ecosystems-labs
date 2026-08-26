

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BNmWUE8d.js","_app/immutable/chunks/B2LA58bN.js","_app/immutable/chunks/EuDlYfJe.js","_app/immutable/chunks/BUJ3CoCm.js"];
export const stylesheets = [];
export const fonts = [];
