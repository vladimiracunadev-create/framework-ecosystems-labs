import asyncio
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()


async def trozos() -> AsyncIterator[bytes]:
    for texto in ("uno\n", "dos\n", "tres\n"):
        yield texto.encode()
        await asyncio.sleep(0.05)


@app.get("/flujo")
def flujo() -> StreamingResponse:
    # StreamingResponse consume un generador asíncrono: nada se acumula en
    # memoria, y el primer trozo sale antes de que exista el último.
    return StreamingResponse(
        trozos(), media_type="text/plain", headers={"cache-control": "no-store"}
    )
