from typing import Any

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import Integer, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

app = FastAPI()


class Base(DeclarativeBase):
    pass


class Cuenta(Base):
    __tablename__ = "cuentas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    saldo: Mapped[int] = mapped_column(Integer)


motor = create_engine("sqlite:///datos.db")
Base.metadata.drop_all(motor)
Base.metadata.create_all(motor)
CrearSesion = sessionmaker(bind=motor, expire_on_commit=False)


class FalloDeNegocio(Exception):
    """Los dos errores de una transferencia, y son distintos.

    `SALDO_INSUFICIENTE` se detecta ANTES de escribir nada: sin transaccion
    tambien quedaria bien. `NO_EXISTE` se detecta DESPUES de haber cobrado, y ese
    es el que necesita la transaccion.
    """

    def __init__(self, estado: int, codigo: str) -> None:
        super().__init__(codigo)
        self.estado = estado
        self.codigo = codigo


def sembrar() -> None:
    with CrearSesion() as s:
        s.query(Cuenta).delete()
        s.add_all([Cuenta(id=1, saldo=100), Cuenta(id=2, saldo=100)])
        s.commit()


sembrar()


def estado() -> dict[str, Any]:
    with CrearSesion() as s:
        saldos = [c.saldo for c in s.scalars(select(Cuenta).order_by(Cuenta.id)).all()]
    return {"cuentas": saldos, "total": sum(saldos)}


def mover(s: Session, cuerpo: dict[str, Any]) -> None:
    de, a, monto = cuerpo.get("de"), cuerpo.get("a"), cuerpo.get("monto", 0)

    origen = s.get(Cuenta, de)
    if origen is None:
        raise FalloDeNegocio(404, "NO_EXISTE")
    if origen.saldo < monto:
        raise FalloDeNegocio(409, "SALDO_INSUFICIENTE")

    # El cobro va PRIMERO, a proposito: es lo que hace visible la diferencia.
    origen.saldo -= monto
    s.flush()

    destino = s.get(Cuenta, a)
    if destino is None:
        raise FalloDeNegocio(404, "NO_EXISTE")
    destino.saldo += monto
    s.flush()


@app.get("/reiniciar")
def reiniciar() -> JSONResponse:
    sembrar()
    return JSONResponse(estado())


@app.get("/cuentas")
def cuentas() -> JSONResponse:
    return JSONResponse(estado())


@app.post("/transferir")
async def transferir(cuerpo: dict[str, Any]) -> JSONResponse:
    """CON transaccion.

    `Session.begin()` abre una transaccion explicita: al salir del bloque hace
    commit, y ante cualquier excepcion hace ROLLBACK. Es la version explicita de
    algo que SQLAlchemy hace igualmente — cada sesion vive dentro de una
    transaccion desde la primera operacion.
    """
    try:
        with CrearSesion() as s, s.begin():
            mover(s, cuerpo)
    except FalloDeNegocio as fallo:
        return JSONResponse({"code": fallo.codigo}, status_code=fallo.estado)
    return JSONResponse({"ok": True})


@app.post("/transferir-sin-transaccion")
async def sin_transaccion(cuerpo: dict[str, Any]) -> JSONResponse:
    """SIN transaccion: mismo codigo, mismo error, diez unidades evaporadas.

    El `commit()` intermedio es lo que rompe la garantia. Confirma el cobro antes
    de saber si el abono es posible, y una vez confirmado ya no hay vuelta atras.
    """
    s = CrearSesion()
    try:
        mover_confirmando(s, cuerpo)
    except FalloDeNegocio as fallo:
        return JSONResponse({"code": fallo.codigo}, status_code=fallo.estado)
    finally:
        s.close()
    return JSONResponse({"ok": True})


def mover_confirmando(s: Session, cuerpo: dict[str, Any]) -> None:
    de, a, monto = cuerpo.get("de"), cuerpo.get("a"), cuerpo.get("monto", 0)

    origen = s.get(Cuenta, de)
    if origen is None:
        raise FalloDeNegocio(404, "NO_EXISTE")
    if origen.saldo < monto:
        raise FalloDeNegocio(409, "SALDO_INSUFICIENTE")

    origen.saldo -= monto
    s.commit()  # <- aqui se pierde la garantia

    destino = s.get(Cuenta, a)
    if destino is None:
        raise FalloDeNegocio(404, "NO_EXISTE")
    destino.saldo += monto
    s.commit()
