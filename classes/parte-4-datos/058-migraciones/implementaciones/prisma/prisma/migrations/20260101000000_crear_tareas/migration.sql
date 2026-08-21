-- La tabla inicial: sin prioridad. Es el estado del que parte la clase.
CREATE TABLE "Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL
);

-- Una fila creada AQUÍ, antes de que la columna exista. Sin ella no habría nada
-- que rellenar en la siguiente migración, y la clase no probaría nada.
INSERT INTO "Tarea" ("titulo") VALUES ('creada antes de la columna');
