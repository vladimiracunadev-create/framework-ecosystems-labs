using Microsoft.EntityFrameworkCore;

var constructor = WebApplication.CreateBuilder(args);
constructor.Services.AddDbContext<Contexto>(opciones => opciones.UseSqlite("Data Source=datos.db"));

var app = constructor.Build();

(string proyecto, string titulo, bool hecha)[] semilla =
[
    ("casa", "comprar pan", true),
    ("casa", "regar", false),
    ("trabajo", "informe", true),
    ("viaje", "reservar", false),
];

// Cuántas FILAS le llegan al proceso. Es la medida honesta de esta clase: los
// dos informes devuelven lo mismo, y lo que cambia es cuánto viaja por la red y
// cuánto trabajo hace el proceso en lugar del motor.
var filasLeidas = 0;

async Task Sembrar(Contexto contexto)
{
    await contexto.Tareas.ExecuteDeleteAsync();
    contexto.ChangeTracker.Clear();
    foreach (var (proyecto, titulo, hecha) in semilla)
    {
        contexto.Tareas.Add(new Tarea { Proyecto = proyecto, Titulo = titulo, Hecha = hecha });
    }
    await contexto.SaveChangesAsync();
    contexto.ChangeTracker.Clear();
    filasLeidas = 0;
}

using (var ambito = app.Services.CreateScope())
{
    var inicial = ambito.ServiceProvider.GetRequiredService<Contexto>();
    await inicial.Database.EnsureDeletedAsync();
    await inicial.Database.EnsureCreatedAsync();
    await Sembrar(inicial);
}

app.MapGet("/reiniciar", async (Contexto contexto) =>
{
    await Sembrar(contexto);
    return Results.Json(new
    {
        tareas = semilla.Length,
        proyectos = semilla.Select(s => s.proyecto).Distinct().Count(),
    });
});

app.MapGet("/filas-leidas", () => Results.Json(new { filas_leidas = filasLeidas }));

// CON EL ORM. EF Core traduce `GroupBy` a SQL desde la versión 7, así que aquí
// se hace a propósito lo que ocurre de verdad cuando la agregación no se puede
// traducir: `ToListAsync()` primero, agrupar después.
//
// Con cuatro tareas da igual. Con cuatro millones, el proceso se queda sin
// memoria haciendo un trabajo que el motor sabe hacer sin moverlas.
app.MapGet("/informe-orm", async (Contexto contexto) =>
{
    var tareas = await contexto.Tareas.ToListAsync();
    filasLeidas = tareas.Count;

    var filas = tareas
        .GroupBy(t => t.Proyecto)
        .OrderBy(g => g.Key, StringComparer.Ordinal)
        .Select(g => new { proyecto = g.Key, total = g.Count(), hechas = g.Count(t => t.Hecha) })
        .ToList();
    return Results.Json(new { filas });
});

// EN SQL. El motor agrupa y devuelve TRES filas.
//
// `FromSql` con una cadena interpolada NO interpola: EF Core intercepta la
// plantilla y convierte cada hueco en un parámetro. Salir del ORM no significa
// salir de las consultas parametrizadas — eso no se negocia nunca.
app.MapGet("/informe-sql", async (Contexto contexto, string? minimo) =>
{
    // El parámetro se valida ANTES de llegar a la consulta: un marcador solo
    // vale para un valor, así que si esperas un número, compruébalo.
    if (!int.TryParse(minimo ?? "1", out var limite) || limite < 0)
    {
        return Results.Json(new { code = "MINIMO_INVALIDO" }, statusCode: 400);
    }

    var filas = await contexto.Database
        .SqlQuery<FilaInforme>($"""
            SELECT proyecto                                AS Proyecto,
                   COUNT(*)                                AS Total,
                   SUM(CASE WHEN hecha THEN 1 ELSE 0 END)  AS Hechas
              FROM Tareas
             GROUP BY proyecto
            HAVING COUNT(*) >= {limite}
             ORDER BY proyecto
            """)
        .ToListAsync();
    filasLeidas = filas.Count;

    return Results.Json(new
    {
        filas = filas.Select(f => new { proyecto = f.Proyecto, total = f.Total, hechas = f.Hechas }),
    });
});

app.Run();

record FilaInforme(string Proyecto, int Total, int Hechas);

class Tarea
{
    public int Id { get; set; }
    public string Proyecto { get; set; } = "";
    public string Titulo { get; set; } = "";
    public bool Hecha { get; set; }
}

class Contexto(DbContextOptions<Contexto> opciones) : DbContext(opciones)
{
    public DbSet<Tarea> Tareas => Set<Tarea>();
}
