-- `DEFAULT 0` no es cosmético: sin él, la fila que ya existía se quedaría con
-- NULL en una columna declarada NOT NULL, y el motor rechazaría la migración.
ALTER TABLE tareas ADD COLUMN prioridad INT NOT NULL DEFAULT 0;
