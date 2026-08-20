using System.Text.Json;
using System.Text.Json.Serialization;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

const string tipo = "application/problem+json";

var esquema = new
{
    type = "object",
    required = new[] { "titulo" },
    additionalProperties = false,
    properties = new
    {
        titulo = new { type = "string", minLength = 1, maxLength = 120 },
        prioridad = new { type = "integer", @enum = new[] { 1, 2, 3 } },
    },
};

app.MapPost("/tareas", async (HttpRequest peticion) =>
{
    Tarea? tarea;
    try
    {
        tarea = await JsonSerializer.DeserializeAsync<Tarea>(peticion.Body);
    }
    catch (JsonException)
    {
        // El atributo `JsonUnmappedMemberHandling.Disallow` de abajo hace que un
        // campo desconocido lance aqui. Sin el, .NET lo IGNORA en silencio.
        return Problema([new { campo = "cuerpo", codigo = "DESCONOCIDO" }]);
    }

    var errores = new List<object>();
    if (tarea?.Titulo is null || tarea.Titulo.Length == 0)
    {
        errores.Add(new { campo = "titulo", codigo = "REQUERIDO" });
    }
    else if (tarea.Titulo.Length > 120)
    {
        errores.Add(new { campo = "titulo", codigo = "LONGITUD" });
    }

    if (tarea?.Prioridad is int p && p is not (1 or 2 or 3))
    {
        errores.Add(new { campo = "prioridad", codigo = "VALOR" });
    }

    if (errores.Count > 0) return Problema(errores);

    return Results.Json(new { titulo = tarea!.Titulo }, statusCode: 201);
});

app.MapGet("/esquemas/tarea", () => Results.Json(esquema));

app.Run();

static IResult Problema(IEnumerable<object> errores) => Results.Text(
    JsonSerializer.Serialize(new
    {
        type = "about:blank",
        title = "la entrada no es valida",
        status = 422,
        code = "VALIDACION",
        errors = errores,
    }),
    "application/problem+json",
    statusCode: 422);

[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
class Tarea
{
    [JsonPropertyName("titulo")]
    public string? Titulo { get; set; }

    [JsonPropertyName("prioridad")]
    public int? Prioridad { get; set; }
}
