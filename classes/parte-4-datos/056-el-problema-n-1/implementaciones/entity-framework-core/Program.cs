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

string[] titulos = ["una", "dos", "tres", "cuatro", "cinco", "seis"];

// Cada tarea con dos etiquetas. El numero de tareas es el parametro del
// experimento, y es lo que permite medir el CRECIMIENTO en lugar de un numero
// suelto que no dice nada.
async Task<int> Sembrar(Contexto contexto, int cuantas)
{
    await contexto.Etiquetas.ExecuteDeleteAsync();
    await contexto.Tareas.ExecuteDeleteAsync();
    contexto.ChangeTracker.Clear();

    var siguiente = 1;
    foreach (var titulo in titulos.Take(cuantas))
    {
        var tarea = new Tarea { Id = siguiente++, Titulo = titulo };
        tarea.Etiquetas.Add(new Etiqueta { Nombre = $"{titulo}-a" });
        tarea.Etiquetas.Add(new Etiqueta { Nombre = $"{titulo}-b" });
        contexto.Tareas.Add(tarea);
    }
    await contexto.SaveChangesAsync();
    contexto.ChangeTracker.Clear();
    contador.Reiniciar();
    return cuantas;
}

using (var ambito = app.Services.CreateScope())
{
    var inicial = ambito.ServiceProvider.GetRequiredService<Contexto>();
    await inicial.Database.EnsureDeletedAsync();
    await inicial.Database.EnsureCreatedAsync();
    await Sembrar(inicial, 3);
}

// LA FORMA INGENUA. EF Core no carga la relacion sola, asi que reproducir el
// N+1 exige pedirla una por una — que es exactamente lo que hace un bucle que
// consulta por elemento.
async Task<List<object>> Ingenua(Contexto contexto)
{
    var tareas = await contexto.Tareas.OrderBy(t => t.Id).ToListAsync();
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
    return resultado;
}

// LA FORMA ANTICIPADA. `Include` trae todo de una vez, y en EF Core lo hace con
// una UNION: UNA sola consulta. `AsSplitQuery()` daria dos. Las dos estan bien,
// y ninguna crece con el numero de filas — que es lo unico que importa.
async Task<List<object>> Anticipada(Contexto contexto)
{
    var tareas = await contexto.Tareas
        .Include(t => t.Etiquetas)
        .OrderBy(t => t.Id)
        .ToListAsync();
    return tareas.Select(t => (object)new
    {
        id = t.Id,
        titulo = t.Titulo,
        etiquetas = t.Etiquetas.Select(e => e.Nombre).OrderBy(n => n).ToList(),
    }).ToList();
}

app.MapGet("/reiniciar", async (Contexto contexto) =>
{
    var tareas = await Sembrar(contexto, 3);
    return Results.Json(new { consultas = contador.Total, tareas });
});

app.MapGet("/consultas", () => Results.Json(new { consultas = contador.Total }));

app.MapGet("/tareas-n1", async (Contexto contexto) =>
    Results.Json(new { tareas = await Ingenua(contexto) }));

app.MapGet("/tareas-anticipada", async (Contexto contexto) =>
    Results.Json(new { tareas = await Anticipada(contexto) }));

// LO UNICO QUE DISTINGUE EL PROBLEMA: si el numero de consultas CRECE con el
// numero de filas. Se mide con tres tareas y con seis, y se resta.
app.MapGet("/crecimiento", async (Contexto contexto, string? ruta) =>
{
    Func<Contexto, Task<List<object>>>? funcion = ruta switch
    {
        "tareas-n1" => Ingenua,
        "tareas-anticipada" => Anticipada,
        _ => null,
    };
    if (funcion is null) return Results.Json(new { code = "RUTA_DESCONOCIDA" }, statusCode: 404);

    await Sembrar(contexto, 3);
    await funcion(contexto);
    var con3 = contador.Total;

    await Sembrar(contexto, 6);
    await funcion(contexto);
    var con6 = contador.Total;

    await Sembrar(contexto, 3);
    return Results.Json(new { con_3 = con3, con_6 = con6, crecimiento = con6 - con3 });
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
        // El identificador se fija a mano en la semilla: el contrato habla de las
        // tareas 1, 2 y 3, y con autoincremento se correrian en cada resiembra.
        constructor.Entity<Tarea>().Property(t => t.Id).ValueGeneratedNever();

        constructor.Entity<Tarea>()
            .HasMany(t => t.Etiquetas)
            .WithOne(e => e.Tarea!)
            .HasForeignKey(e => e.TareaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
