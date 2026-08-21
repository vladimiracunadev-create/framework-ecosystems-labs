using Microsoft.EntityFrameworkCore;

// Entity Framework Core: LINQ traduce a SQL parametrizado. `Where(t => t.Titulo
// == titulo)` genera un WHERE con parametro vinculado — `' OR '1'='1` se busca
// como ese texto exacto. La API de consulta no acepta cadenas de SQL, asi que
// no hay forma de concatenar la entrada sin querer.
var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var opciones = new DbContextOptionsBuilder<Contexto>()
    .UseSqlite("Data Source=datos.db")
    .Options;

using (var contexto = new Contexto(opciones))
{
    await contexto.Database.EnsureDeletedAsync();
    await contexto.Database.EnsureCreatedAsync();
    // Se parte de dos tareas.
    contexto.Tareas.Add(new Tarea { Titulo = "preparar informe" });
    contexto.Tareas.Add(new Tarea { Titulo = "revisar contrato" });
    await contexto.SaveChangesAsync();
}

app.MapPost("/tareas", async (Cuerpo? cuerpo) =>
{
    using var contexto = new Contexto(opciones);
    var tarea = new Tarea { Titulo = cuerpo?.Titulo ?? "" };
    contexto.Tareas.Add(tarea);
    await contexto.SaveChangesAsync();
    return Results.Json(new { id = tarea.Id.ToString(), titulo = tarea.Titulo }, statusCode: 201);
});

app.MapGet("/tareas", async (string? titulo) =>
{
    using var contexto = new Contexto(opciones);
    var consulta = titulo is null
        ? contexto.Tareas.OrderBy(t => t.Id)
        : contexto.Tareas.Where(t => t.Titulo == titulo).OrderBy(t => t.Id);
    var filas = await consulta.ToListAsync();
    return Results.Json(new
    {
        total = filas.Count,
        tareas = filas.Select(t => new { id = t.Id.ToString(), titulo = t.Titulo }),
    });
});

app.MapGet("/tareas/{id}", async (long id) =>
{
    using var contexto = new Contexto(opciones);
    var tarea = await contexto.Tareas.FindAsync(id);
    return tarea is null
        ? Results.Json(new { error = "no-encontrada" }, statusCode: 404)
        : Results.Json(new { id = tarea.Id.ToString(), titulo = tarea.Titulo });
});

app.Run();

class Tarea
{
    public long Id { get; set; }
    public string Titulo { get; set; } = "";
}

class Cuerpo
{
    public string? Titulo { get; set; }
}

class Contexto(DbContextOptions<Contexto> opciones) : DbContext(opciones)
{
    public DbSet<Tarea> Tareas => Set<Tarea>();
}
