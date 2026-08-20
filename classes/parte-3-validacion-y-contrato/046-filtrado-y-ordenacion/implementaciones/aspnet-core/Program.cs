var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var tareas = new List<Tarea>
{
    new("1", "beta", 2, false),
    new("2", "alfa", 1, true),
    new("3", "gamma", 3, false),
};

var ordenables = new HashSet<string> { "titulo", "prioridad" };
var filtrables = new HashSet<string> { "completada", "prioridad" };

app.MapGet("/tareas", (HttpRequest peticion) =>
{
    IEnumerable<Tarea> resultado = tareas;

    foreach (var (campo, valor) in peticion.Query)
    {
        if (campo == "orden") continue;
        if (!filtrables.Contains(campo))
        {
            return Results.Json(new { code = "CAMPO_NO_FILTRABLE", campo }, statusCode: 422);
        }
        if (campo == "completada")
        {
            if (!bool.TryParse(valor, out var esperado))
            {
                return Results.Json(new { code = "VALOR_INVALIDO", campo }, statusCode: 422);
            }
            resultado = resultado.Where(t => t.Completada == esperado);
        }
        if (campo == "prioridad")
        {
            if (!int.TryParse(valor, out var esperada))
            {
                return Results.Json(new { code = "VALOR_INVALIDO", campo }, statusCode: 422);
            }
            resultado = resultado.Where(t => t.Prioridad == esperada);
        }
    }

    var orden = peticion.Query["orden"].FirstOrDefault();
    if (!string.IsNullOrEmpty(orden))
    {
        var descendente = orden.StartsWith('-');
        var campo = descendente ? orden[1..] : orden;
        if (!ordenables.Contains(campo))
        {
            return Results.Json(new { code = "CAMPO_NO_ORDENABLE", campo }, statusCode: 422);
        }

        // La lista blanca se traduce a un selector CONOCIDO, no a una
        // expresion construida con el texto del cliente.
        Func<Tarea, object> clave = campo == "titulo" ? t => t.Titulo : t => t.Prioridad;
        resultado = descendente
            ? resultado.OrderByDescending(clave)
            : resultado.OrderBy(clave);
    }

    return Results.Json(new
    {
        elementos = resultado.Select(t => new
        {
            id = t.Id, titulo = t.Titulo, prioridad = t.Prioridad, completada = t.Completada,
        }),
    });
});

app.Run();

record Tarea(string Id, string Titulo, int Prioridad, bool Completada);
