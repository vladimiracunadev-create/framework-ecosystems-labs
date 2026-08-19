# Laboratorio 03 — FastAPI adapter

Compara tipos, validación declarativa, documentación y manejo de errores con la referencia Node.

Entorno sugerido:

```bash
python -m venv .venv
# Activa el entorno según tu sistema.
python -m pip install -e labs/03-fastapi
python -m uvicorn main:app --app-dir labs/03-fastapi --host 127.0.0.1 --port 3002
```

El uso de `pip` corresponde al ecosistema Python; la restricción pnpm aplica a JavaScript/TypeScript.

El adaptador es pedagógico. El reto consiste en normalizar los errores automáticos de FastAPI exactamente al contrato TaskFlow y agregar idempotencia persistente.
