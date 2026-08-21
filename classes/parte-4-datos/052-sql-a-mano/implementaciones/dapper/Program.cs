using Dapper;
using Microsoft.Data.Sqlite;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

const string Cadena = "Data Source=datos.db";

using (var inicial = new SqliteConnection(Cadena))
{
    inicial.Execute("DROP TABLE IF EXISTS tareas");
    inicial.Execute("""
        CREATE TABLE tareas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL
        )
        """);
}

// Cada petición abre su propia conexión. Dapper no gestiona ninguna: son
// métodos de extensión sobre `IDbConnection`, y quién la abre y cuándo se cierra
// es cosa tuya.
static SqliteConnection Conectar() => new(Cadena);

// El objeto anónimo `new { titulo }` se convierte en PARÁMETROS de la sentencia,
// no en texto pegado. El valor viaja aparte, y por eso `'; DROP TABLE tareas; --`
// acaba siendo un título de tarea y no una orden.
app.MapPost("/tareas", async (Entrada entrada) =>
{
    using var conexion = Conectar();
    var tarea = await conexion.QuerySingleAsync<Tarea>(
        "INSERT INTO tareas (titulo) VALUES (@titulo) RETURNING id, titulo",
        new { titulo = entrada.Titulo ?? "" });
    return Results.Json(new { id = tarea.Id, titulo = tarea.Titulo }, statusCode: 201);
});

app.MapGet("/tareas", async (string? titulo) =>
{
    using var conexion = Conectar();
    var filas = titulo is null
        ? await conexion.QueryAsync<Tarea>("SELECT id, titulo FROM tareas ORDER BY id")
        : await conexion.QueryAsync<Tarea>(
            "SELECT id, titulo FROM tareas WHERE titulo = @titulo ORDER BY id",
            new { titulo });
    var tareas = filas.Select(t => new { id = t.Id, titulo = t.Titulo }).ToList();
    return Results.Json(new { tareas, total = tareas.Count });
});

app.MapGet("/tareas/{id:int}", async (int id) =>
{
    using var conexion = Conectar();
    var tarea = await conexion.QuerySingleOrDefaultAsync<Tarea>(
        "SELECT id, titulo FROM tareas WHERE id = @id", new { id });
    return tarea is null
        ? Results.Json(new { code = "NO_EXISTE" }, statusCode: 404)
        : Results.Json(new { id = tarea.Id, titulo = tarea.Titulo });
});

app.Run();

record Entrada(string? Titulo);

// Dapper mapea columnas a propiedades por nombre, sin distinguir mayúsculas.
// `titulo` encaja con `Titulo` sin configurar nada.
class Tarea
{
    public int Id { get; set; }
    public string Titulo { get; set; } = "";
}
