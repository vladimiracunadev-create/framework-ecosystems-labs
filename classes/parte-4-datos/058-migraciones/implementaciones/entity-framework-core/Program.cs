using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

var constructor = WebApplication.CreateBuilder(args);

// Se parte de una base que NO EXISTE: así las migraciones se ejecutan de verdad
// al arrancar, en orden, y el historial que lee `/historial` lo escribieron
// ellas. Con una base ya migrada, la clase probaría bastante menos.
if (File.Exists("datos.db")) File.Delete("datos.db");

constructor.Services.AddDbContext<Contexto>(opciones => opciones
    .UseSqlite("Data Source=datos.db")
    // Las migraciones de `Migraciones/` están escritas a mano en lugar de
    // generadas por `dotnet ef`, y esta comprobación compara la instantánea del
    // modelo con las entidades para avisar de que falta una migración. Aquí no
    // falta ninguna, así que se silencia.
    .ConfigureWarnings(avisos => avisos.Ignore(RelationalEventId.PendingModelChangesWarning)));

var app = constructor.Build();

using (var ambito = app.Services.CreateScope())
{
    // `Migrate()` aplica las migraciones que faltan y nada más. Es el
    // equivalente de `dotnet ef database update`, y el que se usa en un
    // despliegue: no genera archivos ni compara modelos.
    await ambito.ServiceProvider.GetRequiredService<Contexto>().Database.MigrateAsync();
}

// El historial vive en una tabla de la propia base: `__EFMigrationsHistory`.
static async Task<List<string>> Aplicadas(Contexto contexto) =>
    (await contexto.Database.GetAppliedMigrationsAsync()).ToList();

app.MapGet("/historial", async (Contexto contexto) =>
{
    var aplicadas = await Aplicadas(contexto);
    return Results.Json(new { aplicadas, total = aplicadas.Count });
});

// El esquema se lee del CATÁLOGO de la base, no del modelo de EF Core. Leerlo
// del modelo probaría que la clase dice lo que dice, no que la migración se
// aplicó — que es justo lo que esta clase quiere comprobar.
app.MapGet("/esquema", async (Contexto contexto) =>
{
    var columnas = new List<string>();
    // La conexión es del contexto: se abre, pero NO se cierra ni se libera aquí.
    var conexion = contexto.Database.GetDbConnection();
    await conexion.OpenAsync();
    await using (var orden = conexion.CreateCommand())
    {
        orden.CommandText = "SELECT name FROM pragma_table_info('Tareas') ORDER BY name";
        await using var lector = await orden.ExecuteReaderAsync();
        while (await lector.ReadAsync()) columnas.Add(lector.GetString(0).ToLowerInvariant());
    }
    return Results.Json(new { columnas });
});

app.MapGet("/tareas", async (Contexto contexto) =>
{
    var tareas = await contexto.Tareas.OrderBy(t => t.Id)
        .Select(t => new { id = t.Id, titulo = t.Titulo, prioridad = t.Prioridad })
        .ToListAsync();
    return Results.Json(new { tareas });
});

app.MapPost("/tareas", async (Contexto contexto, Entrada entrada) =>
{
    var tarea = new Tarea { Titulo = entrada.Titulo ?? "", Prioridad = entrada.Prioridad };
    contexto.Tareas.Add(tarea);
    await contexto.SaveChangesAsync();
    return Results.Json(
        new { id = tarea.Id, titulo = tarea.Titulo, prioridad = tarea.Prioridad },
        statusCode: 201);
});

// Volver a migrar no aplica nada: la historia ya las tiene.
app.MapPost("/migrar", async (Contexto contexto) =>
{
    var antes = await Aplicadas(contexto);
    await contexto.Database.MigrateAsync();
    var despues = await Aplicadas(contexto);
    return Results.Json(new { nuevas = despues.Count - antes.Count, total = despues.Count });
});

app.Run();

record Entrada(string? Titulo, int Prioridad);

class Tarea
{
    public int Id { get; set; }
    public string Titulo { get; set; } = "";
    public int Prioridad { get; set; }
}

class Contexto(DbContextOptions<Contexto> opciones) : DbContext(opciones)
{
    public DbSet<Tarea> Tareas => Set<Tarea>();

    protected override void OnModelCreating(ModelBuilder constructor)
    {
        constructor.Entity<Tarea>().Property(t => t.Prioridad).HasDefaultValue(0);
    }
}
