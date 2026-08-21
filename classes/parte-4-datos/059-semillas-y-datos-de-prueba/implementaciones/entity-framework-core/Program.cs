using System.Text.Json;
using Microsoft.EntityFrameworkCore;

var constructor = WebApplication.CreateBuilder(args);
constructor.Services.AddDbContext<Contexto>(opciones => opciones.UseSqlite("Data Source=datos.db"));

var app = constructor.Build();

using (var ambito = app.Services.CreateScope())
{
    var inicial = ambito.ServiceProvider.GetRequiredService<Contexto>();
    await inicial.Database.EnsureDeletedAsync();
    await inicial.Database.EnsureCreatedAsync();
}

// LA SEMILLA ES UN DATO, NO CÓDIGO. Estar en un archivo aparte tiene dos
// consecuencias prácticas: se revisa en una pull request como cualquier otro
// dato, y se puede cargar desde una prueba sin arrancar el servidor.
var catalogo = JsonSerializer.Deserialize<List<Fila>>(
    File.ReadAllText("catalogo.json"),
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;

/// IDEMPOTENTE POR IDENTIFICADOR, NO POR «SI ESTÁ VACÍA».
///
/// EF Core no tiene una operación de inserción-o-actualización: se busca y se
/// decide. Como los identificadores del catálogo son fijos, sembrar dos veces
/// deja el mismo estado y no se lleva por delante lo que hayan añadido otros.
///
/// La alternativa que se ve mucho —«si la tabla está vacía, siembra»— falla en
/// cuanto el catálogo crece: la fila nueva no entra nunca.
async Task<int> Sembrar(Contexto contexto)
{
    var creadas = 0;
    foreach (var fila in catalogo)
    {
        var existente = await contexto.Tareas.FindAsync(fila.Id);
        if (existente is null)
        {
            contexto.Tareas.Add(new Tarea { Id = fila.Id, Titulo = fila.Titulo });
            creadas++;
        }
        else
        {
            existente.Titulo = fila.Titulo;
        }
    }
    await contexto.SaveChangesAsync();
    contexto.ChangeTracker.Clear();
    return creadas;
}

app.MapPost("/sembrar", async (Contexto contexto) =>
{
    var creadas = await Sembrar(contexto);
    return Results.Json(new { creadas, total = await contexto.Tareas.CountAsync() });
});

// REINICIAR ES OTRA OPERACIÓN: borra y vuelve a sembrar.
app.MapPost("/reiniciar", async (Contexto contexto) =>
{
    await contexto.Tareas.ExecuteDeleteAsync();
    contexto.ChangeTracker.Clear();
    var creadas = await Sembrar(contexto);
    return Results.Json(new { creadas, total = await contexto.Tareas.CountAsync() });
});

app.MapGet("/tareas", async (Contexto contexto) =>
{
    var tareas = await contexto.Tareas.OrderBy(t => t.Id)
        .Select(t => new { id = t.Id, titulo = t.Titulo }).ToListAsync();
    return Results.Json(new { tareas, total = tareas.Count });
});

app.MapPost("/tareas", async (Contexto contexto, Entrada entrada) =>
{
    // El identificador de una tarea añadida a mano se calcula a partir del
    // máximo: con `ValueGeneratedNever` el motor ya no los reparte.
    var siguiente = await contexto.Tareas.AnyAsync()
        ? await contexto.Tareas.MaxAsync(t => t.Id) + 1
        : 1;
    var tarea = new Tarea { Id = siguiente, Titulo = entrada.Titulo ?? "" };
    contexto.Tareas.Add(tarea);
    await contexto.SaveChangesAsync();
    return Results.Json(new { id = tarea.Id, titulo = tarea.Titulo }, statusCode: 201);
});

app.Run();

record Entrada(string? Titulo);

record Fila(int Id, string Titulo);

class Tarea
{
    public int Id { get; set; }
    public string Titulo { get; set; } = "";
}

class Contexto(DbContextOptions<Contexto> opciones) : DbContext(opciones)
{
    public DbSet<Tarea> Tareas => Set<Tarea>();

    protected override void OnModelCreating(ModelBuilder constructor)
    {
        // Sin esto, la semilla no podría fijar los identificadores 1, 2 y 3 — y
        // «reproducible» dejaría de incluir la parte que más cuesta reproducir.
        constructor.Entity<Tarea>().Property(t => t.Id).ValueGeneratedNever();
    }
}
