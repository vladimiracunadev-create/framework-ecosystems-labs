using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var tarea = new Dictionary<string, string> { ["id"] = "1", ["titulo"] = "original" };

string Etiqueta()
{
    var crudo = Encoding.UTF8.GetBytes($"{tarea["id"]}|{tarea["titulo"]}");
    var resumen = SHA256.HashData(crudo);
    return "\"" + Convert.ToHexString(resumen)[..16].ToLowerInvariant() + "\"";
}

app.MapGet("/tareas/1", (HttpRequest peticion, HttpResponse respuesta) =>
{
    var actual = Etiqueta();
    respuesta.Headers.ETag = actual;

    if (peticion.Headers.IfNoneMatch.FirstOrDefault() == actual)
    {
        return Results.StatusCode(304);
    }
    return Results.Json(tarea);
});

app.MapPut("/tareas/1", (Cuerpo? cuerpo, HttpRequest peticion, HttpResponse respuesta) =>
{
    var actual = Etiqueta();
    var exigida = peticion.Headers.IfMatch.FirstOrDefault();

    if (string.IsNullOrEmpty(exigida))
    {
        return Results.Json(new { code = "PRECONDICION_REQUERIDA" }, statusCode: 428);
    }
    if (exigida != actual)
    {
        return Results.Json(new { code = "PRECONDICION_FALLIDA" }, statusCode: 412);
    }

    tarea["titulo"] = cuerpo?.Titulo ?? "";
    respuesta.Headers.ETag = Etiqueta();
    return Results.Json(tarea);
});

app.Run();

class Cuerpo
{
    [JsonPropertyName("titulo")]
    public string? Titulo { get; set; }
}
