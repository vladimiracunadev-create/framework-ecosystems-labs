// TaskFlow sobre ASP.NET Core (API mínima).
//
// Mismo contrato, mismas pruebas de aceptación. La comparación interesante con
// la referencia está en el enlace automático del modelo: es cómodo, pero
// analiza el cuerpo ANTES de que el manejador mire la clave de idempotencia,
// así que el contrato obliga a leer el cuerpo a mano para conservar el orden
// de las comprobaciones. Comodidad y control no son gratis a la vez.

using System.Collections.Concurrent;
using System.Text.Json;
using System.Text.Json.Nodes;

const int TitleMax = 120;
const int MaxBodyBytes = 64 * 1024;
const string ProblemBase = "https://vladimiracunadev-create.github.io/framework-ecosystems-labs/problems";

var catalogo = new Dictionary<string, (int Status, string Title)>
{
    ["IDEMPOTENCY_KEY_REQUIRED"] = (400, "Idempotency key required"),
    ["MALFORMED_JSON"] = (400, "Malformed JSON"),
    ["TASK_NOT_FOUND"] = (404, "Task not found"),
    ["ROUTE_NOT_FOUND"] = (404, "Route not found"),
    ["METHOD_NOT_ALLOWED"] = (405, "Method not allowed"),
    ["IDEMPOTENCY_KEY_REUSED"] = (409, "Idempotency key reused"),
    ["BODY_TOO_LARGE"] = (413, "Body too large"),
    ["UNSUPPORTED_MEDIA_TYPE"] = (415, "Unsupported media type"),
    ["VALIDATION_ERROR"] = (422, "Validation error"),
    ["INTERNAL_ERROR"] = (500, "Internal error"),
};

// Punto único de construcción de errores. Devuelve application/problem+json con
// los miembros que exige RFC 9457 más las extensiones `code` y `errors`.
IResult Problem(
    string code,
    string? detail = null,
    string? instance = null,
    IEnumerable<object>? errors = null,
    string? allow = null)
{
    var (status, title) = catalogo.TryGetValue(code, out var entrada) ? entrada : catalogo["INTERNAL_ERROR"];
    var cuerpo = new Dictionary<string, object?>
    {
        ["type"] = $"{ProblemBase}/{code.ToLowerInvariant().Replace('_', '-')}",
        ["title"] = title,
        ["status"] = status,
        ["code"] = code,
    };
    if (detail is not null) cuerpo["detail"] = detail;
    if (instance is not null) cuerpo["instance"] = instance;
    if (errors is not null) cuerpo["errors"] = errors;

    return Results.Json(cuerpo, statusCode: status, contentType: "application/problem+json");
}

object Campo(string field, string code, string detail) => new { field, code, detail };

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
var app = builder.Build();

var tasks = new ConcurrentDictionary<string, TaskItem>();
var orden = new List<string>();
var idempotency = new ConcurrentDictionary<string, (TaskItem Task, string Fingerprint)>();
var sequence = 0;

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

// La instantánea se toma bajo cerrojo: recorrer la lista mientras otra petición
// la amplía es una excepción intermitente que solo aparece con concurrencia.
app.MapGet("/tasks", () =>
{
    List<TaskItem> items;
    lock (orden) { items = orden.Where(tasks.ContainsKey).Select(id => tasks[id]).ToList(); }
    return Results.Ok(new { items });
});

app.MapGet("/tasks/{taskId}", (string taskId) => tasks.TryGetValue(taskId, out var task)
    ? Results.Ok(task)
    : Problem("TASK_NOT_FOUND", instance: $"/tasks/{taskId}"));

app.MapPost("/tasks", async (HttpRequest request) =>
{
    var contentType = request.ContentType ?? "";
    if (!contentType.StartsWith("application/json", StringComparison.OrdinalIgnoreCase))
    {
        return Problem("UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json", "/tasks");
    }

    if (request.ContentLength is > MaxBodyBytes)
    {
        return Problem("BODY_TOO_LARGE", instance: "/tasks");
    }

    var key = request.Headers["Idempotency-Key"].ToString().Trim();
    if (string.IsNullOrEmpty(key))
    {
        return Problem(
            "IDEMPOTENCY_KEY_REQUIRED",
            "POST is not idempotent: send a client-generated Idempotency-Key",
            "/tasks");
    }

    // Lectura acotada y asíncrona. El buffer tiene un carácter más que el
    // límite: si se llena por completo, el cuerpo lo superaba. Comprobarlo con
    // `EndOfStream` sería una lectura síncrona, y ASP.NET Core las prohíbe por
    // omisión precisamente para no bloquear el hilo de la petición.
    using var lector = new StreamReader(request.Body);
    var buffer = new char[MaxBodyBytes + 1];
    var leidos = await lector.ReadBlockAsync(buffer.AsMemory(0, buffer.Length));
    if (leidos > MaxBodyBytes)
    {
        return Problem("BODY_TOO_LARGE", instance: "/tasks");
    }
    var crudo = new string(buffer, 0, leidos);

    JsonNode? entrada;
    try
    {
        entrada = string.IsNullOrWhiteSpace(crudo) ? new JsonObject() : JsonNode.Parse(crudo);
    }
    catch (JsonException)
    {
        return Problem("MALFORMED_JSON", instance: "/tasks");
    }

    var huella = entrada?.ToJsonString() ?? "{}";
    if (idempotency.TryGetValue(key, out var previo))
    {
        if (previo.Fingerprint != huella)
        {
            return Problem(
                "IDEMPOTENCY_KEY_REUSED",
                "The key was already used with a different request body",
                "/tasks");
        }
        return Results.Ok(previo.Task);
    }

    // Misma regla que la referencia: el error nombra el campo que falló.
    var errores = new List<object>();
    var objeto = entrada as JsonObject;
    if (objeto is null)
    {
        errores.Add(Campo("", "BODY_NOT_OBJECT", "The body must be a JSON object"));
    }
    else
    {
        var nodoTitulo = objeto.TryGetPropertyValue("title", out var valor) ? valor : null;
        var titulo = nodoTitulo?.GetValueKind() == JsonValueKind.String ? nodoTitulo!.GetValue<string>() : null;
        if (titulo is null)
        {
            errores.Add(Campo("title", "TITLE_REQUIRED", "title is required and must be a string"));
        }
        else if (titulo.Trim().Length == 0)
        {
            errores.Add(Campo("title", "TITLE_EMPTY", "title must not be blank"));
        }
        else if (titulo.Trim().Length > TitleMax)
        {
            errores.Add(Campo("title", "TITLE_TOO_LONG", $"title must not exceed {TitleMax} characters"));
        }
    }

    if (errores.Count > 0)
    {
        return Problem("VALIDATION_ERROR", "The request body failed validation", "/tasks", errores);
    }

    var task = new TaskItem(
        $"task-{Interlocked.Increment(ref sequence)}",
        objeto!["title"]!.GetValue<string>().Trim(),
        false,
        DateTimeOffset.UtcNow.ToString("o"));

    tasks[task.Id] = task;
    lock (orden) { orden.Add(task.Id); }
    idempotency[key] = (task, huella);
    return Results.Created($"/tasks/{task.Id}", task);
});

// Métodos no admitidos sobre rutas que sí existen: un 405 sin Allow deja al
// cliente adivinando qué método sí vale.
app.MapMethods("/health", ["POST", "PUT", "PATCH", "DELETE"],
    (HttpResponse response) => { response.Headers.Allow = "GET"; return Problem("METHOD_NOT_ALLOWED", instance: "/health"); });
app.MapMethods("/tasks", ["PUT", "PATCH", "DELETE"],
    (HttpResponse response) => { response.Headers.Allow = "GET, POST"; return Problem("METHOD_NOT_ALLOWED", instance: "/tasks"); });
app.MapMethods("/tasks/{taskId}", ["POST", "PUT", "PATCH", "DELETE"],
    (HttpResponse response) => { response.Headers.Allow = "GET"; return Problem("METHOD_NOT_ALLOWED", instance: "/tasks"); });

app.MapFallback(() => Problem("ROUTE_NOT_FOUND"));

var puerto = Environment.GetEnvironmentVariable("PORT") ?? "3004";
app.Run($"http://127.0.0.1:{puerto}");

record TaskItem(string Id, string Title, bool Completed, string CreatedAt);
