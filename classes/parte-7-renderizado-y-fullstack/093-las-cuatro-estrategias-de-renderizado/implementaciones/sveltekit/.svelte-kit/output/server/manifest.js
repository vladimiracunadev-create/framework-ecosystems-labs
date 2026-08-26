export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BAvDXBvR.js",app:"_app/immutable/entry/app.DO5zNTGV.js",imports:["_app/immutable/entry/start.BAvDXBvR.js","_app/immutable/chunks/EuDlYfJe.js","_app/immutable/chunks/T3FPz01V.js","_app/immutable/chunks/CSKszjpO.js","_app/immutable/entry/app.DO5zNTGV.js","_app/immutable/chunks/EuDlYfJe.js","_app/immutable/chunks/Ck_unVqa.js","_app/immutable/chunks/B2LA58bN.js","_app/immutable/chunks/CSKszjpO.js","_app/immutable/chunks/BUJ3CoCm.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/servidor",
				pattern: /^\/servidor\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set(["/cliente","/estatico","/estatico/__data.json","/estrategias.json","/tareas.json"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
