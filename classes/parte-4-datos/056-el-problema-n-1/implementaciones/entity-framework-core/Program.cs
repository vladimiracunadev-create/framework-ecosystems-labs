using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

var constructor = WebApplication.CreateBuilder(args);

// Un interceptor cuenta CADA comando que EF Core envia a la base. Es la forma
// nativa de medir esto: el resultado del N+1 es correcto, y lo que falla es
// cuanto costo obtenerlo.
var contador = new Contador();

constructor.Services.AddDbContext<Contexto>(opciones => opciones
    .UseSqlite("Data Source=datos.db")
    .AddInterceptors(contador));

var app = constructor.Build();

using (var ambito = app.Services.CreateScope())
{
    var contexto = ambito.ServiceProvider.GetRequiredService<Contexto>();
    contexto.Database.EnsureDeleted();
    contexto.Database.EnsureCreated();

    foreach (var titulo in new[] { "una", "dos", "tres" })
    {
        var tarea = new Tarea { Titulo = titulo };
        tarea.Etiquetas.Add(new Etiqueta { Nombre = $"{titulo}-a" });
        tarea.Etiquetas.Add(new Etiqueta { Nombre = $"{titulo}-b" });
        contexto.Tareas.Add(tarea);
    }
    await contexto.SaveChangesAsync();
}

app.MapGet("/reiniciar", () =>
{
    contador.Reiniciar();
    return Results.Json(new { ok = true });
});

app.MapGet("/consultas", () => Results.Json(new { consultas = contador.Total }));

// LA FORMA INGENUA. EF Core no carga la relacion sola, asi que reproducir el
// N+1 exige pedirla una por una — que es exactamente lo que hace un bucle que
// consulta por elemento.
app.MapGet("/tareas-n1", async (Contexto contexto) =>
{
    var tareas = await contexto.Tareas.ToListAsync();
    var resultado = new List<object>();
    foreach (var tarea in tareas)
    {
        var etiquetas = await contexto.Etiquetas
            .Where(e => e.TareaId == tarea.Id)
            .Select(e => e.Nombre)
            .OrderBy(n => n)
            .ToListAsync();
        resultado.Add(new { id = tarea.Id, titulo = tarea.Titulo, etiquetas });
    }
    return Results.Json(new { tareas = resultado });
});

// LA FORMA ANTICIPADA: `Include` trae todo de una vez.
app.MapGet("/tareas-anticipada", async (Contexto contexto) =>
{
    var tareas = await contexto.Tareas.Include(t => t.Etiquetas).ToListAsync();
    return Results.Json(new
    {
        tareas = tareas.Select(t => new
        {
            id = t.Id,
            titulo = t.Titulo,
            etiquetas = t.Etiquetas.Select(e => e.Nombre).OrderBy(n => n).ToList(),
        }),
    });
});

app.Run();

class Contador : DbCommandInterceptor
{
    private int total;

    public int Total => total;

    public void Reiniciar() => Interlocked.Exchange(ref total, 0);

    public override ValueTask<DbDataReader> ReaderExecutedAsync(
        DbCommand comando, CommandExecutedEventData datos, DbDataReader resultado,
        CancellationToken cancelacion = default)
    {
        Interlocked.Increment(ref total);
        return base.ReaderExecutedAsync(comando, datos, resultado, cancelacion);
    }
}

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
        constructor.Entity<Tarea>()
            .HasMany(t => t.Etiquetas)
            .WithOne(e => e.Tarea!)
            .HasForeignKey(e => e.TareaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
