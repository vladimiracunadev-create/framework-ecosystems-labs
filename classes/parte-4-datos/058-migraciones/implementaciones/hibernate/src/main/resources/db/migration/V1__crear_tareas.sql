-- La tabla inicial: sin prioridad. Es el estado del que parte la clase.
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL
);

-- Una fila creada AQUÍ, antes de que la columna exista. Sin ella no habría nada
-- que rellenar en la siguiente migración, y la clase no probaría nada.
INSERT INTO tareas (titulo) VALUES ('creada antes de la columna');
