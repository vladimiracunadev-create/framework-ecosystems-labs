using Microsoft.EntityFrameworkCore;

var constructor = WebApplication.CreateBuilder(args);

constructor.Services.AddDbContext<Contexto>(opciones => opciones.UseSqlite("Data Source=datos.db"));
// El repositorio se registra como servicio: los manejadores piden la interfaz y
// no saben que detrás hay EF Core. Es lo que hace sustituible la persistencia.
constructor.Services.AddScoped<IRepositorioDeTareas, RepositorioEfCore>();

var app = constructor.Build();

using (var ambito = app.Services.CreateScope())
{
    var contexto = ambito.ServiceProvider.GetRequiredService<Contexto>();
    await contexto.Database.EnsureDeletedAsync();
    await contexto.Database.EnsureCreatedAsync();
}

app.MapPost("/tareas", async (IRepositorioDeTareas repositorio, Entrada entrada) =>
{
    Tarea tarea;
    try
    {
        // La regla se comprueba en la FÁBRICA del dominio, antes de que el
        // repositorio entre en escena. Una tarea inválida no llega a existir.
        tarea = Tarea.Crear(entrada.Titulo);
    }
    catch (TituloRequerido)
    {
        return Results.Json(new { code = "TITULO_REQUERIDO" }, statusCode: 422);
    }
    await repositorio.GuardarAsync(tarea);
    return Results.Json(tarea.Salida(), statusCode: 201);
});

app.MapGet("/tareas", async (IRepositorioDeTareas repositorio) =>
{
    var tareas = await repositorio.TodasAsync();
    return Results.Json(new { tareas = tareas.Select(t => t.Salida()), total = tareas.Count });
});

app.MapGet("/tareas/{id:int}", async (IRepositorioDeTareas repositorio, int id) =>
{
    var tarea = await repositorio.PorIdAsync(id);
    return tarea is null
        ? Results.Json(new { code = "NO_EXISTE" }, statusCode: 404)
        : Results.Json(tarea.Salida());
});

app.MapPatch("/tareas/{id:int}", async (IRepositorioDeTareas repositorio, int id, Cambio cambio) =>
{
    var tarea = await repositorio.PorIdAsync(id);
    if (tarea is null) return Results.Json(new { code = "NO_EXISTE" }, statusCode: 404);

    try
    {
        if (cambio.Titulo is not null) tarea.Renombrar(cambio.Titulo);
        if (cambio.Hecha is not null) tarea.Marcar(cambio.Hecha.Value);
    }
    catch (TituloRequerido)
    {
        return Results.Json(new { code = "TITULO_REQUERIDO" }, statusCode: 422);
    }

    await repositorio.GuardarAsync(tarea);
    return Results.Json(tarea.Salida());
});

app.MapDelete("/tareas/{id:int}", async (IRepositorioDeTareas repositorio, int id) =>
{
    var tarea = await repositorio.PorIdAsync(id);
    if (tarea is null) return Results.Json(new { code = "NO_EXISTE" }, statusCode: 404);
    await repositorio.BorrarAsync(tarea);
    return Results.NoContent();
});

app.Run();

record Entrada(string? Titulo);

record Cambio(string? Titulo, bool? Hecha);

/// <summary>La regla es del dominio, no de la base ni del framework web.</summary>
class TituloRequerido : Exception;

/// <summary>
/// LA ENTIDAD. No tiene `Guardar()`, ni `Buscar()`, ni `Borrar()`.
///
/// Ese es el patrón Data Mapper: la entidad describe qué es una tarea y qué sabe
/// hacer; quien la guarda es el repositorio. Y aquí la clase está limpia de
/// verdad —ni un atributo de persistencia— porque el mapeo vive en el contexto.
/// </summary>
class Tarea
{
    // El constructor sin argumentos no es opcional: al leer una fila, EF Core
    // construye el objeto vacío y DESPUÉS le pone los campos. Por eso las reglas
    // van en una fábrica y no en el constructor.
    public Tarea() { }

    public int Id { get; set; }
    public string Titulo { get; set; } = "";
    public bool Hecha { get; set; }

    public static Tarea Crear(string? titulo)
    {
        var tarea = new Tarea();
        tarea.Renombrar(titulo);
        return tarea;
    }

    public void Renombrar(string? titulo)
    {
        if (string.IsNullOrWhiteSpace(titulo)) throw new TituloRequerido();
        Titulo = titulo;
    }

    public void Marcar(bool hecha) => Hecha = hecha;

    public object Salida() => new { id = Id, titulo = Titulo, hecha = Hecha };
}

/// <summary>
/// La interfaz vive del lado del dominio y no menciona EF Core. Es lo que
/// permite probar la lógica con un doble en memoria — clase 065.
/// </summary>
interface IRepositorioDeTareas
{
    Task<Tarea> GuardarAsync(Tarea tarea);
    Task<Tarea?> PorIdAsync(int id);
    Task<List<Tarea>> TodasAsync();
    Task BorrarAsync(Tarea tarea);
}

class RepositorioEfCore(Contexto contexto) : IRepositorioDeTareas
{
    public async Task<Tarea> GuardarAsync(Tarea tarea)
    {
        if (tarea.Id == 0) contexto.Tareas.Add(tarea);
        await contexto.SaveChangesAsync();
        return tarea;
    }

    public Task<Tarea?> PorIdAsync(int id) =>
        contexto.Tareas.FirstOrDefaultAsync(t => t.Id == id);

    public Task<List<Tarea>> TodasAsync() =>
        contexto.Tareas.OrderBy(t => t.Id).ToListAsync();

    public async Task BorrarAsync(Tarea tarea)
    {
        contexto.Tareas.Remove(tarea);
        await contexto.SaveChangesAsync();
    }
}

/// <summary>
/// EL MAPEADOR. Todo lo que sabe de tablas está aquí, y solo aquí.
/// </summary>
class Contexto(DbContextOptions<Contexto> opciones) : DbContext(opciones)
{
    public DbSet<Tarea> Tareas => Set<Tarea>();

    protected override void OnModelCreating(ModelBuilder constructor)
    {
        var tarea = constructor.Entity<Tarea>();
        tarea.ToTable("tareas");
        tarea.HasKey(t => t.Id);
        tarea.Property(t => t.Titulo).IsRequired().HasMaxLength(120);
        tarea.Property(t => t.Hecha).HasDefaultValue(false);
    }
}
