var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// `contexto.Items` es el almacén por petición: nace y muere con ella.
void Capa(string nombre) => app.Use(async (contexto, siguiente) =>
{
    if (!contexto.Items.TryGetValue("traza", out var valor))
    {
        valor = new List<string>();
        contexto.Items["traza"] = valor;
    }
    ((List<string>)valor!).Add($"entra:{nombre}");
    await siguiente();
    // Lo de aquí se ejecuta al volver, en orden inverso.
});

// El orden es el de registro: lo que se lee de arriba abajo se ejecuta de fuera
// adentro. Es el modelo más predecible de los cuatro.
Capa("uno");
Capa("dos");
Capa("tres");

app.MapGet("/traza", (HttpContext contexto) =>
{
    var traza = (List<string>)contexto.Items["traza"]!;
    traza.Add("manejador");
    return Results.Json(new { traza });
});

app.Run();
