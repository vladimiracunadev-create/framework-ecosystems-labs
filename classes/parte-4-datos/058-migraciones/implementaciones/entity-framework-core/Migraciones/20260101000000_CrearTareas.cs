using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Labs.Migraciones;

/// <summary>
/// La tabla inicial: sin prioridad. Es el estado del que parte la clase.
///
/// Estos archivos los genera `dotnet ef migrations add`, y son C# corriente:
/// se leen, se revisan en una pull request y se editan cuando hace falta —que
/// es exactamente lo que se hace aquí para insertar la fila de partida.
/// </summary>
[Migration("20260101000000_CrearTareas")]
[DbContext(typeof(Contexto))]
public class CrearTareas : Migration
{
    protected override void Up(MigrationBuilder constructor)
    {
        constructor.CreateTable(
            name: "Tareas",
            columns: tabla => new
            {
                Id = tabla.Column<int>(type: "INTEGER", nullable: false)
                    .Annotation("Sqlite:Autoincrement", true),
                Titulo = tabla.Column<string>(type: "TEXT", nullable: false),
            },
            constraints: tabla => tabla.PrimaryKey("PK_Tareas", x => x.Id));

        // Una fila creada AQUÍ, antes de que la columna exista. Sin ella no
        // habría nada que rellenar en la migración siguiente.
        constructor.InsertData(
            table: "Tareas",
            column: "Titulo",
            value: "creada antes de la columna");
    }

    protected override void Down(MigrationBuilder constructor)
    {
        constructor.DropTable(name: "Tareas");
    }
}
