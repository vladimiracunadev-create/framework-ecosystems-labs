import { TAREAS } from "../../datos";

// El origen de datos de la pantalla de cliente, aparte del HTML.
export default defineEventHandler(() => ({ tareas: TAREAS }));
