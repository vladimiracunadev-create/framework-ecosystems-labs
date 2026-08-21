using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Labs.Migraciones;

/// <summary>
/// Añadir la columna de prioridad, con relleno para las filas que ya estaban.
/// </summary>
[Migration("20260101000100_AnadirPrioridad")]
[DbContext(typeof(Contexto))]
public class AnadirPrioridad : Migration
{
    protected override void Up(MigrationBuilder constructor)
    {
        // `defaultValue` no es cosmético: sin él, la fila que ya existía se
        // quedaría con NULL en una columna declarada NOT NULL, y el motor
        // rechazaría la migración entera.
        constructor.AddColumn<int>(
            name: "Prioridad",
            table: "Tareas",
            type: "INTEGER",
            nullable: false,
            defaultValue: 0);
    }

    protected override void Down(MigrationBuilder constructor)
    {
        // Existe, y no devuelve los datos: quitar la columna los borra.
        constructor.DropColumn(name: "Prioridad", table: "Tareas");
    }
}
