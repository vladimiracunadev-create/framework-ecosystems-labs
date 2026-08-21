using Microsoft.EntityFrameworkCore;

var constructor = WebApplication.CreateBuilder(args);

// `AddDbContext` registra el contexto con ambito POR PETICION —la clase 037— y
// mantiene el grupo de conexiones a nivel de proceso. Construir un contexto a
// mano en cada manejador desperdiciaria ese grupo.
constructor.Services.AddDbContext<Contexto>(opciones =>
    opciones.UseSqlite("Data Source=datos.db"));

var app = constructor.Build();

// La base se recrea al arrancar para que la clase parta siempre del mismo
// estado. En produccion esto seria una migracion — clase 058.
using (var ambito = app.Services.CreateScope())
{
    var contexto = ambito.ServiceProvider.GetRequiredService<Contexto>();
    contexto.Database.EnsureDeleted();
    contexto.Database.EnsureCreated();
}

app.MapGet("/salud", async (Contexto contexto) =>
{
    try
    {
        // `CanConnectAsync` abre una conexion de verdad: comprobar que el
        // objeto existe no probaria nada.
        var vivo = await contexto.Database.CanConnectAsync();
        return vivo
            ? Results.Json(new { conectado = true })
            : Results.Json(new { conectado = false }, statusCode: 503);
    }
    catch
    {
        return Results.Json(new { conectado = false }, statusCode: 503);
    }
});

app.MapPost("/tareas", async (Cuerpo? cuerpo, Contexto contexto) =>
{
    var tarea = new Tarea { Titulo = cuerpo?.Titulo ?? "" };
    contexto.Tareas.Add(tarea);
    await contexto.SaveChangesAsync();
    return Results.Json(new { id = tarea.Id, titulo = tarea.Titulo }, statusCode: 201);
});

app.MapGet("/tareas/{id}", async (int id, Contexto contexto) =>
{
    var tarea = await contexto.Tareas.FindAsync(id);
    return tarea is null
        ? Results.Json(new { code = "NO_EXISTE" }, statusCode: 404)
        : Results.Json(new { id = tarea.Id, titulo = tarea.Titulo });
});

app.Run();

class Tarea
{
    public int Id { get; set; }
    public string Titulo { get; set; } = "";
}

class Contexto(DbContextOptions<Contexto> opciones) : DbContext(opciones)
{
    public DbSet<Tarea> Tareas => Set<Tarea>();
}

class Cuerpo
{
    public string? Titulo { get; set; }
}
