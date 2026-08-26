
import root from '../root.js';
import { set_building, set_prerendering } from '$app/env/internal';
import { set_assets } from '$app/paths/internal/server';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env } from '../../../node_modules/.pnpm/@sveltejs+kit@2.70.3_@svelt_75258759b5a8f5bd2b54bd10eb9422c7/node_modules/@sveltejs/kit/src/runtime/shared-server.js';
import error from '../shared/error-template.js';

export const options = {
	app_template_contains_nonce: false,
	async: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	csrf_trusted_origins: [],
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hash_routing: false,
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	service_worker_options: undefined,
	server_error_boundaries: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!DOCTYPE html>\n<html lang=\"es\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <title>Clase 093</title>\n    " + head + "\n  </head>\n  <body>\n    <!--\n      LA PLANTILLA DE LA PÁGINA, con dos huecos que SvelteKit rellena.\n\n      `%sveltekit.head%` recibe los enlaces a hojas de estilo y los metadatos de\n      la ruta; `" + body + "` recibe el marcado del componente.\n\n      Que exista este archivo es la señal de que SvelteKit controla el documento\n      entero: no hay un `index.html` que el enrutador manipule después. Por eso\n      la clase 101 —metadatos— tiene aquí una respuesta limpia.\n    -->\n    <div>%sveltekit.body%</div>\n  </body>\n</html>\n",
		error
	},
	version_hash: "c75l05"
};

export async function get_hooks() {
	let handle;
	let handleFetch;
	let handleError;
	let handleValidationError;
	let init;
	

	let reroute;
	let transport;
	

	return {
		handle,
		handleFetch,
		handleError,
		handleValidationError,
		init,
		reroute,
		transport
	};
}

export { set_assets, set_building, set_manifest, set_prerendering, set_private_env, set_public_env, set_read_implementation };
