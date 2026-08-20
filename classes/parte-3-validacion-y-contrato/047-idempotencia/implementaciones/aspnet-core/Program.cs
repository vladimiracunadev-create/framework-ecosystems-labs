using System.Collections.Concurrent;
using System.Text.Json.Serialization;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var tareas = new ConcurrentDictionary<string, object>();
var respuestas = new ConcurrentDictionary<string, object>();
var siguiente = 0;

object Crear(string titulo)
{
    var id = Interlocked.Increment(ref siguiente).ToString();
    var tarea = new { id, titulo };
    tareas[id] = tarea;
    return tarea;
}

app.MapPost("/tareas", (Cuerpo? cuerpo, HttpRequest peticion, HttpResponse respuesta) =>
{
    var titulo = cuerpo?.Titulo ?? "";
    var clave = peticion.Headers["Idempotency-Key"].FirstOrDefault();

    if (string.IsNullOrEmpty(clave))
    {
        return Results.Json(Crear(titulo), statusCode: 201);
    }

    if (respuestas.TryGetValue(clave, out var previa))
    {
        respuesta.Headers["Idempotent-Replay"] = "true";
        return Results.Json(previa, statusCode: 201);
    }

    // `GetOrAdd` es atomico: dos peticiones simultaneas con la misma clave no
    // pueden crear dos tareas.
    var creada = respuestas.GetOrAdd(clave, _ => Crear(titulo));
    return Results.Json(creada, statusCode: 201);
});

app.MapGet("/tareas", () => Results.Json(new { total = tareas.Count }));

app.Run();

class Cuerpo
{
    [JsonPropertyName("titulo")]
    public string? Titulo { get; set; }
}
