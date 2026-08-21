-- `DEFAULT 0` no es cosmético: sin él, la fila que ya existía se quedaría con
-- NULL en una columna declarada NOT NULL, y el motor rechazaría la migración.
ALTER TABLE "Tarea" ADD COLUMN "prioridad" INTEGER NOT NULL DEFAULT 0;
