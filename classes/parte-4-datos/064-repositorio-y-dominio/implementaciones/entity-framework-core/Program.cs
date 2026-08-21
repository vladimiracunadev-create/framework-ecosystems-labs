using Labs.Dominio;
using Microsoft.EntityFrameworkCore;

var constructor = WebApplication.CreateBuilder(args);

constructor.Services.AddDbContext<Contexto>(opciones => opciones.UseSqlite("Data Source=datos.db"));
// El manejador pide la INTERFAZ. Cambiar `RepositorioEfCore` por
// `RepositorioEnMemoria` en esta línea dejaría el servicio entero funcionando
// sin base de datos — que es, literalmente, lo que hace `/pruebas-del-dominio`.
constructor.Services.AddScoped<IRepositorio, RepositorioEfCore>();

var app = constructor.Build();

using (var ambito = app.Services.CreateScope())
{
    var contexto = ambito.ServiceProvider.GetRequiredService<Contexto>();
    await contexto.Database.EnsureDeletedAsync();
    await contexto.Database.EnsureCreatedAsync();
}

static IResult Responder(ReglaRota fallo) =>
    Results.Json(new { code = fallo.Codigo },
        statusCode: fallo.Codigo == "NO_EXISTE" ? 404 : 409);

// LA COMPROBACIÓN QUE HACE HONESTA A ESTA CLASE.
//
// Se lee el archivo del dominio y se miran sus `using`. No cualquier mención: el
// propio comentario de ese archivo dice «no usa Entity Framework», y buscar la
// palabra suelta daría un falso positivo. Lo que importa es DE QUÉ DEPENDE el
// archivo, no de qué habla.
app.MapGet("/dominio", async () =>
{
    var texto = await File.ReadAllTextAsync("Dominio.cs");
    var importados = texto.Split('\n')
        .Select(linea => linea.TrimEnd('\r'))
        .Where(linea => linea.StartsWith("using "))
        .ToList();
    string[] prohibidas = ["entityframework", "microsoft.aspnetcore", "sqlite"];
    return Results.Json(new
    {
        menciona_orm = importados.Any(l => prohibidas.Any(p => l.ToLowerInvariant().Contains(p))),
        importa = importados,
        reglas = System.Text.RegularExpressions.Regex.Matches(texto, "REGLA [0-9]").Count,
    });
});

app.MapPost("/proyectos", async (IRepositorio repositorio, EntradaProyecto entrada) =>
{
    var proyecto = new Proyecto(await repositorio.SiguienteIdProyectoAsync(), entrada.Nombre ?? "");
    await repositorio.GuardarAsync(proyecto);
    return Results.Json(proyecto.Salida(), statusCode: 201);
});

app.MapPost("/proyectos/{id:long}/tareas",
    async (IRepositorio repositorio, long id, EntradaTarea entrada) =>
{
    var proyecto = await repositorio.PorIdAsync(id);
    if (proyecto is null) return Results.Json(new { code = "NO_EXISTE" }, statusCode: 404);

    try
    {
        // La regla se aplica EN EL DOMINIO. El manejador no sabe cuáles son ni
        // en qué orden se comprueban: solo traduce el fallo a un código HTTP.
        proyecto.AnadirTarea(await repositorio.SiguienteIdTareaAsync(), entrada.Titulo ?? "");
    }
    catch (ReglaRota fallo)
    {
        return Responder(fallo);
    }

    await repositorio.GuardarAsync(proyecto);
    return Results.Json(proyecto.Salida(), statusCode: 201);
});

app.MapPost("/proyectos/{id:long}/tareas/{tarea:long}/terminar",
    async (IRepositorio repositorio, long id, long tarea) =>
{
    var proyecto = await repositorio.PorIdAsync(id);
    if (proyecto is null) return Results.Json(new { code = "NO_EXISTE" }, statusCode: 404);

    try
    {
        proyecto.TerminarTarea(tarea);
    }
    catch (ReglaRota fallo)
    {
        return Responder(fallo);
    }

    await repositorio.GuardarAsync(proyecto);
    return Results.Json(proyecto.Salida());
});

app.MapPost("/proyectos/{id:long}/cerrar", async (IRepositorio repositorio, long id) =>
{
    var proyecto = await repositorio.PorIdAsync(id);
    if (proyecto is null) return Results.Json(new { code = "NO_EXISTE" }, statusCode: 404);

    try
    {
        proyecto.Cerrar();
    }
    catch (ReglaRota fallo)
    {
        return Responder(fallo);
    }

    await repositorio.GuardarAsync(proyecto);
    return Results.Json(proyecto.Salida());
});

app.MapGet("/proyectos/{id:long}", async (IRepositorio repositorio, long id) =>
{
    var proyecto = await repositorio.PorIdAsync(id);
    return proyecto is null
        ? Results.Json(new { code = "NO_EXISTE" }, statusCode: 404)
        : Results.Json(proyecto.Salida());
});

// LAS MISMAS TRES REGLAS, CONTRA EL REPOSITORIO EN MEMORIA.
//
// Sin base de datos, sin esquema, sin limpiar tablas. Es el argumento entero de
// esta clase, y aquí se ejecuta de verdad en lugar de afirmarse.
app.MapGet("/pruebas-del-dominio", async () =>
{
    var memoria = new RepositorioEnMemoria();
    var resultados = new List<object>();

    static object Comprobar(string nombre, Action operacion, string esperado)
    {
        try
        {
            operacion();
            return new { nombre, paso = false, motivo = "no lanzó" };
        }
        catch (ReglaRota fallo)
        {
            return new { nombre, paso = fallo.Codigo == esperado, motivo = fallo.Codigo };
        }
    }

    var uno = new Proyecto(await memoria.SiguienteIdProyectoAsync(), "pruebas");
    uno.AnadirTarea(await memoria.SiguienteIdTareaAsync(), "pendiente");
    await memoria.GuardarAsync(uno);
    resultados.Add(Comprobar("no se cierra con pendientes", uno.Cerrar, "QUEDAN_PENDIENTES"));

    var dos = new Proyecto(await memoria.SiguienteIdProyectoAsync(), "cerrado");
    dos.Cerrar();
    var idTarde = await memoria.SiguienteIdTareaAsync();
    resultados.Add(Comprobar("no se añade a uno cerrado",
        () => dos.AnadirTarea(idTarde, "tarde"), "PROYECTO_CERRADO"));

    var tres = new Proyecto(await memoria.SiguienteIdProyectoAsync(), "repetidos");
    tres.AnadirTarea(await memoria.SiguienteIdTareaAsync(), "misma");
    var idRepetido = await memoria.SiguienteIdTareaAsync();
    resultados.Add(Comprobar("no se repite el título",
        () => tres.AnadirTarea(idRepetido, "misma"), "TITULO_REPETIDO"));

    var pasadas = resultados.Count(r => (bool)r.GetType().GetProperty("paso")!.GetValue(r)!);
    return Results.Json(new
    {
        ejecutadas = resultados.Count,
        pasadas,
        uso_base_de_datos = false,
        detalle = resultados,
    });
});

app.Run();

record EntradaProyecto(string? Nombre);

record EntradaTarea(string? Titulo);

/// <summary>El modelo de PERSISTENCIA, distinto del de dominio.</summary>
class FilaProyecto
{
    public long Id { get; set; }
    public string Nombre { get; set; } = "";
    public bool Cerrado { get; set; }
    public List<FilaTarea> Tareas { get; set; } = [];
}

class FilaTarea
{
    public long Id { get; set; }
    public string Titulo { get; set; } = "";
    public bool Hecha { get; set; }
    public long ProyectoId { get; set; }
    public FilaProyecto? Proyecto { get; set; }
}

/// <summary>Para el servicio. Traduce entre las filas y las entidades del dominio.</summary>
class RepositorioEfCore(Contexto contexto) : IRepositorio
{
    /// <summary>
    /// Devuelve una ENTIDAD DEL DOMINIO, no una fila.
    ///
    /// Es la línea que separa un repositorio de verdad de uno decorativo: si
    /// devolviera la fila, el dominio dependería de EF Core igual que antes.
    /// </summary>
    public async Task<Proyecto?> PorIdAsync(long id)
    {
        var fila = await contexto.Proyectos
            .Include(p => p.Tareas)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (fila is null) return null;

        var tareas = fila.Tareas
            .OrderBy(t => t.Id)
            .Select(t => new Tarea(t.Id, t.Titulo, t.Hecha))
            .ToList();
        return new Proyecto(fila.Id, fila.Nombre, fila.Cerrado, tareas);
    }

    public async Task<Proyecto> GuardarAsync(Proyecto proyecto)
    {
        var fila = await contexto.Proyectos
            .Include(p => p.Tareas)
            .FirstOrDefaultAsync(p => p.Id == proyecto.Id);
        if (fila is null)
        {
            fila = new FilaProyecto { Id = proyecto.Id };
            contexto.Proyectos.Add(fila);
        }
        fila.Nombre = proyecto.Nombre;
        fila.Cerrado = proyecto.Cerrado;

        foreach (var tarea in proyecto.Tareas)
        {
            var destino = fila.Tareas.FirstOrDefault(t => t.Id == tarea.Id);
            if (destino is null)
            {
                destino = new FilaTarea { Id = tarea.Id };
                fila.Tareas.Add(destino);
            }
            destino.Titulo = tarea.Titulo;
            destino.Hecha = tarea.Hecha;
        }

        await contexto.SaveChangesAsync();
        contexto.ChangeTracker.Clear();
        return proyecto;
    }

    public async Task<long> SiguienteIdProyectoAsync() =>
        await contexto.Proyectos.AnyAsync()
            ? await contexto.Proyectos.MaxAsync(p => p.Id) + 1
            : 1;

    public async Task<long> SiguienteIdTareaAsync() =>
        await contexto.Tareas.AnyAsync()
            ? await contexto.Tareas.MaxAsync(t => t.Id) + 1
            : 1;
}

class Contexto(DbContextOptions<Contexto> opciones) : DbContext(opciones)
{
    public DbSet<FilaProyecto> Proyectos => Set<FilaProyecto>();
    public DbSet<FilaTarea> Tareas => Set<FilaTarea>();

    protected override void OnModelCreating(ModelBuilder constructor)
    {
        constructor.Entity<FilaProyecto>().Property(p => p.Id).ValueGeneratedNever();
        constructor.Entity<FilaTarea>().Property(t => t.Id).ValueGeneratedNever();
        constructor.Entity<FilaProyecto>()
            .HasMany(p => p.Tareas)
            .WithOne(t => t.Proyecto!)
            .HasForeignKey(t => t.ProyectoId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
