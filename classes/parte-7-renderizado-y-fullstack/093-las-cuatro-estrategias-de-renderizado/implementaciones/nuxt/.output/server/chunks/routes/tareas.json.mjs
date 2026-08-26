import { c as defineEventHandler } from '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const TAREAS = ["comprar pan", "regar las plantas", "llamar al taller"];

const tareas_json = defineEventHandler(() => ({ tareas: TAREAS }));

export { tareas_json as default };
//# sourceMappingURL=tareas.json.mjs.map
