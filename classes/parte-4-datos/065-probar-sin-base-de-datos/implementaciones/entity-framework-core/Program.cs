using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

// TRES FORMAS DE PROBAR LO MISMO.
//
// - `doble`: un objeto en memoria que imita al repositorio. No hay motor.
// - `en-memoria`: una base de VERDAD, creada para las pruebas y desechable.
// - `real`: la misma base que usa el servicio.
//
// Las cuatro pruebas son idénticas en las tres. Lo que cambia es qué detectan —
// y una de ellas solo pasa cuando hay un motor detrás.

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var opcionesReales = new DbContextOptionsBuilder<Contexto>()
    .UseSqlite("Data Source=datos.db")
    .Options;

// La conexión de la base en memoria se mantiene ABIERTA a propósito: SQLite
// destruye una base `:memory:` en cuanto se cierra su última conexión, y las
// pruebas no verían nada de lo que escribieron.
var conexionPruebas = new SqliteConnection("Data Source=:memory:");
conexionPruebas.Open();
var opcionesPruebas = new DbContextOptionsBuilder<Contexto>()
    .UseSqlite(conexionPruebas)
    .Options;

using (var contexto = new Contexto(opcionesReales))
{
    await contexto.Database.EnsureDeletedAsync();
    await contexto.Database.EnsureCreatedAsync();
}
using (var contexto = new Contexto(opcionesPruebas))
{
    await contexto.Database.EnsureCreatedAsync();
}

string[] estrategias = ["doble", "en-memoria", "real"];

IRepositorio RepositorioDe(string estrategia) => estrategia switch
{
    "doble" => new Doble(),
    "en-memoria" => new RepositorioEfCore(opcionesPruebas),
    _ => new RepositorioEfCore(opcionesReales),
};

// LAS CUATRO PRUEBAS. Las mismas para las tres estrategias.
(string Nombre, Func<IRepositorio, Task<bool>> Ejecutar)[] pruebas =
[
    ("se crea y devuelve un identificador",
        async r => (await r.CrearAsync("comprar pan")).Id > 0),
    ("se lee de vuelta lo que se escribió", async r =>
    {
        var creada = await r.CrearAsync("regar");
        var leida = await r.PorIdAsync(creada.Id);
        return leida is not null && leida.Titulo == "regar";
    }),
    ("lo borrado deja de estar", async r =>
    {
        var creada = await r.CrearAsync("llamar");
        await r.BorrarAsync(creada.Id);
        return await r.PorIdAsync(creada.Id) is null;
    }),
    ("la restricción de unicidad la aplica la base, no el código", async r =>
    {
        await r.CrearAsync("repetida");
        try
        {
            await r.CrearAsync("repetida");
            return false; // no protestó: el hueco del doble
        }
        catch (DbUpdateException)
        {
            return true;
        }
    }),
];

async Task<List<object>> Ejecutar(string estrategia)
{
    var repositorio = RepositorioDe(estrategia);
    var resultados = new List<object>();
    foreach (var (nombre, prueba) in pruebas)
    {
        await repositorio.LimpiarAsync();
        bool paso;
        try
        {
            paso = await prueba(repositorio);
        }
        catch (Exception)
        {
            paso = false;
        }
        resultados.Add(new { nombre, paso });
    }
    await repositorio.LimpiarAsync();
    return resultados;
}

static bool Paso(object resultado) =>
    (bool)resultado.GetType().GetProperty("paso")!.GetValue(resultado)!;

app.MapGet("/estrategias", () =>
    Results.Json(new { estrategias, pruebas_por_estrategia = pruebas.Length }));

app.MapGet("/probar", async (string? estrategia) =>
{
    if (estrategia is null || !estrategias.Contains(estrategia))
    {
        return Results.Json(new { code = "ESTRATEGIA_DESCONOCIDA" }, statusCode: 400);
    }
    var resultados = await Ejecutar(estrategia);
    return Results.Json(new
    {
        estrategia,
        ejecutadas = resultados.Count,
        pasadas = resultados.Count(Paso),
        usa_motor = estrategia != "doble",
        detalle = resultados,
    });
});

// DÓNDE ESTÁ EL HUECO, exactamente.
app.MapGet("/que-se-escapa", async () =>
{
    var indice = pruebas.Length - 1;
    return Results.Json(new
    {
        prueba = "la restricción de unicidad la aplica la base, no el código",
        doble = Paso((await Ejecutar("doble"))[indice]),
        en_memoria = Paso((await Ejecutar("en-memoria"))[indice]),
        real = Paso((await Ejecutar("real"))[indice]),
    });
});

// Y POR QUÉ SE USA IGUALMENTE EL DOBLE: porque es mucho más rápido.
app.MapGet("/comparacion", async () =>
{
    var tiempos = new Dictionary<string, long>();
    foreach (var estrategia in estrategias)
    {
        var reloj = System.Diagnostics.Stopwatch.StartNew();
        for (var i = 0; i < 20; i++) await Ejecutar(estrategia);
        tiempos[estrategia] = reloj.ElapsedMilliseconds;
    }
    return Results.Json(new
    {
        tiempos_ms = tiempos,
        repeticiones = 20,
        doble_es_el_mas_rapido = tiempos["doble"] == tiempos.Values.Min(),
    });
});

app.Run();

record Fila(long Id, string Titulo);

interface IRepositorio
{
    Task LimpiarAsync();
    Task<Fila> CrearAsync(string titulo);
    Task<Fila?> PorIdAsync(long id);
    Task BorrarAsync(long id);
}

/// <summary>
/// EL DOBLE.
///
/// Hace lo mismo con un diccionario, y no comprueba la unicidad — igual que el
/// repositorio de verdad, que tampoco la comprueba: la aplica la base.
///
/// Ese detalle es la clase entera. El doble no es incorrecto: es INCOMPLETO, y
/// su hueco tiene exactamente la forma de lo que el motor hacía por ti.
/// </summary>
class Doble : IRepositorio
{
    private readonly Dictionary<long, Fila> filas = [];
    private long siguiente = 1;

    public Task LimpiarAsync()
    {
        filas.Clear();
        siguiente = 1;
        return Task.CompletedTask;
    }

    public Task<Fila> CrearAsync(string titulo)
    {
        var fila = new Fila(siguiente++, titulo);
        filas[fila.Id] = fila;
        return Task.FromResult(fila);
    }

    public Task<Fila?> PorIdAsync(long id) =>
        Task.FromResult(filas.TryGetValue(id, out var fila) ? fila : null);

    public Task BorrarAsync(long id)
    {
        filas.Remove(id);
        return Task.CompletedTask;
    }
}

/// <summary>El repositorio de verdad: delega en el motor y deja que él aplique sus reglas.</summary>
class RepositorioEfCore(DbContextOptions<Contexto> opciones) : IRepositorio
{
    public async Task LimpiarAsync()
    {
        using var contexto = new Contexto(opciones);
        await contexto.Tareas.ExecuteDeleteAsync();
    }

    public async Task<Fila> CrearAsync(string titulo)
    {
        using var contexto = new Contexto(opciones);
        var tarea = new Tarea { Titulo = titulo };
        contexto.Tareas.Add(tarea);
        await contexto.SaveChangesAsync();
        return new Fila(tarea.Id, tarea.Titulo);
    }

    public async Task<Fila?> PorIdAsync(long id)
    {
        using var contexto = new Contexto(opciones);
        var tarea = await contexto.Tareas.FirstOrDefaultAsync(t => t.Id == id);
        return tarea is null ? null : new Fila(tarea.Id, tarea.Titulo);
    }

    public async Task BorrarAsync(long id)
    {
        using var contexto = new Contexto(opciones);
        await contexto.Tareas.Where(t => t.Id == id).ExecuteDeleteAsync();
    }
}

class Tarea
{
    public long Id { get; set; }
    public string Titulo { get; set; } = "";
}

class Contexto(DbContextOptions<Contexto> opciones) : DbContext(opciones)
{
    public DbSet<Tarea> Tareas => Set<Tarea>();

    protected override void OnModelCreating(ModelBuilder constructor)
    {
        // LA RESTRICCIÓN QUE DECIDE LA CLASE. La aplica la BASE, no el código —
        // y por eso un doble en memoria no la ve.
        constructor.Entity<Tarea>().HasIndex(t => t.Titulo).IsUnique();
    }
}
