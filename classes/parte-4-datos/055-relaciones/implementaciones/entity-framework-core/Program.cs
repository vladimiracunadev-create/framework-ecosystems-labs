using Microsoft.EntityFrameworkCore;

var constructor = WebApplication.CreateBuilder(args);
constructor.Services.AddDbContext<Contexto>(opciones =>
    opciones.UseSqlite("Data Source=datos.db"));

var app = constructor.Build();

using (var ambito = app.Services.CreateScope())
{
    var contexto = ambito.ServiceProvider.GetRequiredService<Contexto>();
    contexto.Database.EnsureDeleted();
    contexto.Database.EnsureCreated();
}

app.MapPost("/tareas", async (Cuerpo? cuerpo, Contexto contexto) =>
{
    var tarea = new Tarea { Titulo = cuerpo?.Titulo ?? "" };
    foreach (var nombre in cuerpo?.Etiquetas ?? [])
    {
        // Basta con anadir al hijo: EF Core deduce la clave ajena de la
        // relacion. No hace falta poner los dos lados, a diferencia de JPA.
        tarea.Etiquetas.Add(new Etiqueta { Nombre = nombre });
    }
    contexto.Tareas.Add(tarea);
    await contexto.SaveChangesAsync();
    return Results.Json(Salida(tarea), statusCode: 201);
});

app.MapGet("/tareas/{id}", async (int id, Contexto contexto) =>
{
    // `Include` es la carga ANTICIPADA. EF Core NO activa la carga perezosa por
    // omision: sin `Include`, la lista llega VACIA en lugar de dispararse otra
    // consulta.
    //
    // Es una decision distinta a la de JPA y evita el problema de la clase 056,
    // a cambio de un fallo mas silencioso: una lista vacia parece un dato, no un
    // olvido.
    var tarea = await contexto.Tareas
        .Include(t => t.Etiquetas)
        .FirstOrDefaultAsync(t => t.Id == id);

    return tarea is null
        ? Results.Json(new { code = "NO_EXISTE" }, statusCode: 404)
        : Results.Json(Salida(tarea));
});

app.MapDelete("/tareas/{id}", async (int id, Contexto contexto) =>
{
    var tarea = await contexto.Tareas.FindAsync(id);
    if (tarea is null) return Results.Json(new { code = "NO_EXISTE" }, statusCode: 404);
    contexto.Tareas.Remove(tarea);
    await contexto.SaveChangesAsync();
    return Results.NoContent();
});

app.MapGet("/etiquetas", async (Contexto contexto) =>
    Results.Json(new { total = await contexto.Etiquetas.CountAsync() }));

app.Run();

static object Salida(Tarea tarea) => new
{
    id = tarea.Id,
    titulo = tarea.Titulo,
    etiquetas = tarea.Etiquetas.Select(e => e.Nombre).OrderBy(n => n).ToList(),
};

class Tarea
{
    public int Id { get; set; }
    public string Titulo { get; set; } = "";
    public List<Etiqueta> Etiquetas { get; set; } = [];
}

class Etiqueta
{
    public int Id { get; set; }
    public string Nombre { get; set; } = "";
    public int TareaId { get; set; }
    public Tarea? Tarea { get; set; }
}

class Contexto(DbContextOptions<Contexto> opciones) : DbContext(opciones)
{
    public DbSet<Tarea> Tareas => Set<Tarea>();
    public DbSet<Etiqueta> Etiquetas => Set<Etiqueta>();

    protected override void OnModelCreating(ModelBuilder constructor)
    {
        // El borrado en cascada se declara aqui: EF Core lo aplica al generar el
        // esquema y al borrar desde el contexto.
        constructor.Entity<Tarea>()
            .HasMany(t => t.Etiquetas)
            .WithOne(e => e.Tarea!)
            .HasForeignKey(e => e.TareaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

class Cuerpo
{
    public string? Titulo { get; set; }
    public List<string>? Etiquetas { get; set; }
}
