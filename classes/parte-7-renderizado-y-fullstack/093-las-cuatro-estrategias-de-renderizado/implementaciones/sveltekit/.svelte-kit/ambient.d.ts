
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const CHROME_CRASHPAD_PIPE_NAME: string;
	export const NODE_ENV: string;
	export const ALLUSERSPROFILE: string;
	export const AI_AGENT: string;
	export const CLAUDE_AGENT_SDK_VERSION: string;
	export const CLAUDE_CODE_EMIT_TOOL_USE_SUMMARIES: string;
	export const ANTHROPIC_BASE_URL: string;
	export const PLINK_PROTOCOL: string;
	export const EXEPATH: string;
	export const API_TIMEOUT_MS: string;
	export const DISABLE_AUTOUPDATER: string;
	export const CLAUDE_CODE_EXECPATH: string;
	export const APPDATA: string;
	export const DISABLE_MICROCOMPACT: string;
	export const BAGGAGE: string;
	export const CLAUDECODE: string;
	export const CLAUDE_CODE_REPORT_FINDINGS: string;
	export const CLAUDE_CODE_CHILD_SESSION: string;
	export const USERDOMAIN_ROAMINGPROFILE: string;
	export const CLAUDE_CODE_SDK_HAS_HOST_AUTH_REFRESH: string;
	export const CLAUDE_CODE_DISABLE_CRON: string;
	export const CLAUDE_CODE_EAGER_FLUSH: string;
	export const CLAUDE_CODE_ENABLE_ASK_USER_QUESTION_TOOL: string;
	export const CLAUDE_CODE_ENTRYPOINT: string;
	export const CLAUDE_CODE_HOST_SESSION_ID: string;
	export const CLAUDE_CODE_SESSION_ID: string;
	export const CLAUDE_CODE_MESSAGING_SOCKET: string;
	export const CLAUDE_CODE_MESSAGING_TOKEN: string;
	export const LOCALAPPDATA: string;
	export const CLAUDE_CODE_OAUTH_SCOPES: string;
	export const CLAUDE_CODE_SDK_HAS_OAUTH_REFRESH: string;
	export const CLAUDE_EFFORT: string;
	export const HOMEPATH: string;
	export const CLAUDE_PID: string;
	export const OneDrive: string;
	export const GIT_EDITOR: string;
	export const CLAUDE_PREVIEW_CLASSIFIER_FLOOR: string;
	export const LOGONSERVER: string;
	export const COMMONPROGRAMFILES: string;
	export const CommonProgramW6432: string;
	export const COMPUTERNAME: string;
	export const OneDriveConsumer: string;
	export const COMSPEC: string;
	export const COREPACK_ENABLE_AUTO_PIN: string;
	export const DriverData: string;
	export const HOME: string;
	export const HOMEDRIVE: string;
	export const MCP_CONNECTION_NONBLOCKING: string;
	export const MSYSTEM: string;
	export const NDI_RUNTIME_DIR_V2: string;
	export const NODE_PATH: string;
	export const NDI_RUNTIME_DIR_V3: string;
	export const NDI_RUNTIME_DIR_V4: string;
	export const NDI_RUNTIME_DIR_V5: string;
	export const NoDefaultCurrentDirectoryInExePath: string;
	export const NODE_USE_SYSTEM_CA: string;
	export const npm_command: string;
	export const OS: string;
	export const npm_config_user_agent: string;
	export const NUMBER_OF_PROCESSORS: string;
	export const PATH: string;
	export const PATHEXT: string;
	export const pnpm_config_verify_deps_before_run: string;
	export const PNPM_PACKAGE_NAME: string;
	export const PROCESSOR_ARCHITECTURE: string;
	export const PROCESSOR_IDENTIFIER: string;
	export const PROCESSOR_LEVEL: string;
	export const PROCESSOR_REVISION: string;
	export const ProgramData: string;
	export const PROGRAMFILES: string;
	export const TERM: string;
	export const ProgramW6432: string;
	export const PROMPT: string;
	export const PSModulePath: string;
	export const PUBLIC: string;
	export const PWD: string;
	export const SHELL: string;
	export const SHLVL: string;
	export const SYSTEMDRIVE: string;
	export const SYSTEMROOT: string;
	export const TEMP: string;
	export const TMP: string;
	export const USERDOMAIN: string;
	export const USERNAME: string;
	export const USERPROFILE: string;
	export const USE_LOCAL_OAUTH: string;
	export const USE_STAGING_OAUTH: string;
	export const VBOX_MSI_INSTALL_PATH: string;
	export const WINDIR: string;
	export const _: string;
	export const SVELTEKIT_FORK: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		CHROME_CRASHPAD_PIPE_NAME: string;
		NODE_ENV: string;
		ALLUSERSPROFILE: string;
		AI_AGENT: string;
		CLAUDE_AGENT_SDK_VERSION: string;
		CLAUDE_CODE_EMIT_TOOL_USE_SUMMARIES: string;
		ANTHROPIC_BASE_URL: string;
		PLINK_PROTOCOL: string;
		EXEPATH: string;
		API_TIMEOUT_MS: string;
		DISABLE_AUTOUPDATER: string;
		CLAUDE_CODE_EXECPATH: string;
		APPDATA: string;
		DISABLE_MICROCOMPACT: string;
		BAGGAGE: string;
		CLAUDECODE: string;
		CLAUDE_CODE_REPORT_FINDINGS: string;
		CLAUDE_CODE_CHILD_SESSION: string;
		USERDOMAIN_ROAMINGPROFILE: string;
		CLAUDE_CODE_SDK_HAS_HOST_AUTH_REFRESH: string;
		CLAUDE_CODE_DISABLE_CRON: string;
		CLAUDE_CODE_EAGER_FLUSH: string;
		CLAUDE_CODE_ENABLE_ASK_USER_QUESTION_TOOL: string;
		CLAUDE_CODE_ENTRYPOINT: string;
		CLAUDE_CODE_HOST_SESSION_ID: string;
		CLAUDE_CODE_SESSION_ID: string;
		CLAUDE_CODE_MESSAGING_SOCKET: string;
		CLAUDE_CODE_MESSAGING_TOKEN: string;
		LOCALAPPDATA: string;
		CLAUDE_CODE_OAUTH_SCOPES: string;
		CLAUDE_CODE_SDK_HAS_OAUTH_REFRESH: string;
		CLAUDE_EFFORT: string;
		HOMEPATH: string;
		CLAUDE_PID: string;
		OneDrive: string;
		GIT_EDITOR: string;
		CLAUDE_PREVIEW_CLASSIFIER_FLOOR: string;
		LOGONSERVER: string;
		COMMONPROGRAMFILES: string;
		CommonProgramW6432: string;
		COMPUTERNAME: string;
		OneDriveConsumer: string;
		COMSPEC: string;
		COREPACK_ENABLE_AUTO_PIN: string;
		DriverData: string;
		HOME: string;
		HOMEDRIVE: string;
		MCP_CONNECTION_NONBLOCKING: string;
		MSYSTEM: string;
		NDI_RUNTIME_DIR_V2: string;
		NODE_PATH: string;
		NDI_RUNTIME_DIR_V3: string;
		NDI_RUNTIME_DIR_V4: string;
		NDI_RUNTIME_DIR_V5: string;
		NoDefaultCurrentDirectoryInExePath: string;
		NODE_USE_SYSTEM_CA: string;
		npm_command: string;
		OS: string;
		npm_config_user_agent: string;
		NUMBER_OF_PROCESSORS: string;
		PATH: string;
		PATHEXT: string;
		pnpm_config_verify_deps_before_run: string;
		PNPM_PACKAGE_NAME: string;
		PROCESSOR_ARCHITECTURE: string;
		PROCESSOR_IDENTIFIER: string;
		PROCESSOR_LEVEL: string;
		PROCESSOR_REVISION: string;
		ProgramData: string;
		PROGRAMFILES: string;
		TERM: string;
		ProgramW6432: string;
		PROMPT: string;
		PSModulePath: string;
		PUBLIC: string;
		PWD: string;
		SHELL: string;
		SHLVL: string;
		SYSTEMDRIVE: string;
		SYSTEMROOT: string;
		TEMP: string;
		TMP: string;
		USERDOMAIN: string;
		USERNAME: string;
		USERPROFILE: string;
		USE_LOCAL_OAUTH: string;
		USE_STAGING_OAUTH: string;
		VBOX_MSI_INSTALL_PATH: string;
		WINDIR: string;
		_: string;
		SVELTEKIT_FORK: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
