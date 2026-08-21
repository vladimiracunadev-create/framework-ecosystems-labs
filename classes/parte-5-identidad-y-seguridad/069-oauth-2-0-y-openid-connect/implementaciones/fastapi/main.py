"""Un servidor de autorización mínimo: código de autorización + PKCE.

En producción no se escribe uno —se despliega Keycloak o se contrata—;
este existe para que cada defensa del protocolo sea medible paso a paso.
"""

import hashlib
import secrets
import time
from base64 import urlsafe_b64encode
from urllib.parse import urlencode

import jwt
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, RedirectResponse

app = FastAPI()

SECRETO = "clave-de-firma-solo-para-el-laboratorio"

# La redirect_uri se registra POR ADELANTADO: la petición debe traer
# exactamente la registrada, o un atacante pediría el código a su servidor.
CLIENTES = {"cliente-demo": {"redireccion": "https://app.example/callback"}}

# Código → lo que hará falta al canjearlo. Un solo uso; en producción,
# además, caduca en minutos.
codigos: dict[str, dict[str, object]] = {}


def _resumen_s256(verificador: str) -> str:
    digesto = hashlib.sha256(verificador.encode()).digest()
    return urlsafe_b64encode(digesto).rstrip(b"=").decode()


@app.get("/autorizar")
def autorizar(request: Request):
    q = request.query_params
    cliente = CLIENTES.get(q.get("client_id", ""))

    # Cliente desconocido o redirect_uri no registrada: error DIRECTO, sin
    # redirigir — redirigir a una URI no verificada sería un open redirect.
    if cliente is None or q.get("redirect_uri") != cliente["redireccion"]:
        return JSONResponse({"error": "invalid_request"}, status_code=400)

    # Aquí iría login y consentimiento; el laboratorio los salta con un
    # usuario fijo porque lo que mide es la mecánica del código y de PKCE.
    estado = q.get("state")

    # Sin PKCE no hay código. La redirect_uri SÍ está verificada, así que el
    # error viaja de vuelta al cliente con el state intacto.
    if (
        q.get("response_type") != "code"
        or not q.get("code_challenge")
        or q.get("code_challenge_method") != "S256"
    ):
        consulta = {"error": "invalid_request"}
        if estado:
            consulta["state"] = estado
        return RedirectResponse(
            f"{cliente['redireccion']}?{urlencode(consulta)}", status_code=302
        )

    codigo = secrets.token_urlsafe(24)
    codigos[codigo] = {
        "reto": q["code_challenge"],
        "redireccion": q["redirect_uri"],
        "cliente": q["client_id"],
        "usado": False,
    }
    consulta = {"code": codigo}
    # El state vuelve TAL CUAL: es el testigo anti-CSRF del cliente.
    if estado:
        consulta["state"] = estado
    return RedirectResponse(f"{cliente['redireccion']}?{urlencode(consulta)}", status_code=302)


@app.post("/token")
async def token(request: Request):
    # Formulario, no JSON: lo dice la especificación del endpoint de token.
    f = await request.form()
    entrada = codigos.get(str(f.get("code", "")))

    invalido = (
        f.get("grant_type") != "authorization_code"
        or entrada is None
        or bool(entrada["usado"])
        or entrada["cliente"] != f.get("client_id")
        or entrada["redireccion"] != f.get("redirect_uri")
    )

    # PKCE: el resumen del verificador de ahora tiene que casar con el reto
    # del principio. Solo quien inició el flujo tiene el verificador.
    resumen = _resumen_s256(str(f.get("code_verifier", "")))

    if invalido or resumen != entrada["reto"]:
        if entrada is not None:
            entrada["usado"] = True
        return JSONResponse({"error": "invalid_grant"}, status_code=400)

    entrada["usado"] = True
    id_token = jwt.encode(
        {
            "iss": "http://laboratorio.local",
            "sub": "ana",
            "aud": f.get("client_id"),
            "exp": int(time.time()) + 3600,
        },
        SECRETO,
        algorithm="HS256",
    )
    return JSONResponse(
        {
            "access_token": secrets.token_urlsafe(24),
            "token_type": "Bearer",
            "expires_in": 3600,
            "id_token": id_token,
        }
    )
