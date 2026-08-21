import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

await prisma.$executeRawUnsafe("DROP TABLE IF EXISTS Cuenta");
await prisma.$executeRawUnsafe(
  "CREATE TABLE Cuenta (id INTEGER PRIMARY KEY AUTOINCREMENT, saldo INTEGER NOT NULL)",
);

async function sembrar() {
  await prisma.$executeRawUnsafe("DELETE FROM Cuenta");
  // Identificadores explícitos: el contrato habla de las cuentas 1 y 2, y
  // dejarlos al autoincremento los correría a 3 y 4 en el segundo reinicio.
  await prisma.cuenta.create({ data: { id: 1, saldo: 100 } });
  await prisma.cuenta.create({ data: { id: 2, saldo: 100 } });
}

await sembrar();

async function estado() {
  const cuentas = await prisma.cuenta.findMany({ orderBy: { id: "asc" } });
  const saldos = cuentas.map((c) => c.saldo);
  return { cuentas: saldos, total: saldos.reduce((a, b) => a + b, 0) };
}

app.get("/reiniciar", async (peticion, respuesta) => {
  await sembrar();
  respuesta.json(await estado());
});

app.get("/cuentas", async (peticion, respuesta) => respuesta.json(await estado()));

/**
 * Los dos errores que puede dar una transferencia, y son distintos:
 *
 * - `SALDO_INSUFICIENTE` se detecta ANTES de escribir nada. Sin transacción
 *   también quedaría bien.
 * - `NO_EXISTE` se detecta DESPUÉS de haber cobrado. Ese es el que necesita la
 *   transacción: sin ella, el dinero ya salió y no llega a ninguna parte.
 */
class FalloDeNegocio extends Error {
  constructor(estado, codigo) {
    super(codigo);
    this.estado = estado;
    this.codigo = codigo;
  }
}

async function mover(cliente, { de, a, monto }) {
  const origen = await cliente.cuenta.findUnique({ where: { id: de } });
  if (!origen) throw new FalloDeNegocio(404, "NO_EXISTE");
  if (origen.saldo < monto) throw new FalloDeNegocio(409, "SALDO_INSUFICIENTE");

  // El cobro va PRIMERO, a propósito: es lo que hace visible la diferencia.
  await cliente.cuenta.update({ where: { id: de }, data: { saldo: origen.saldo - monto } });

  const destino = await cliente.cuenta.findUnique({ where: { id: a } });
  if (!destino) throw new FalloDeNegocio(404, "NO_EXISTE");
  await cliente.cuenta.update({ where: { id: a }, data: { saldo: destino.saldo + monto } });
}

function responderFallo(error, respuesta) {
  if (error instanceof FalloDeNegocio) {
    respuesta.status(error.estado).json({ code: error.codigo });
    return;
  }
  throw error;
}

/**
 * CON transacción. `$transaction` con una función recibe un cliente atado a la
 * transacción, y ese detalle es todo: si se usara `prisma` en lugar de `tx`, las
 * escrituras saldrían FUERA y la vuelta atrás no las alcanzaría.
 *
 * Cualquier excepción que salga del bloque deshace lo escrito dentro.
 */
app.post("/transferir", async (peticion, respuesta) => {
  try {
    await prisma.$transaction((tx) => mover(tx, peticion.body ?? {}));
    respuesta.json({ ok: true });
  } catch (error) {
    responderFallo(error, respuesta);
  }
});

/** SIN transacción: mismo código, mismo error, y diez unidades evaporadas. */
app.post("/transferir-sin-transaccion", async (peticion, respuesta) => {
  try {
    await mover(prisma, peticion.body ?? {});
    respuesta.json({ ok: true });
  } catch (error) {
    responderFallo(error, respuesta);
  }
});

const servidor = app.listen(Number(process.env.PORT ?? 3000));
for (const senal of ["SIGTERM", "SIGINT"]) {
  process.on(senal, async () => {
    servidor.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}
