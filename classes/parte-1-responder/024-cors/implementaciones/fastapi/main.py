from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://permitido.example"],
    allow_methods=["GET", "POST"],
    allow_headers=["content-type", "x-token"],
    max_age=600,
)


@app.get("/datos")
def datos() -> JSONResponse:
    return JSONResponse({"ok": True})
