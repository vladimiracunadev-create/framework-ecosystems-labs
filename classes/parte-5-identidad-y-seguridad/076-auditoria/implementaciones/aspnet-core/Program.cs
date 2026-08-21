using System.Collections.Concurrent;

// La auditoría como SERVICIO inyectado (singleton): un solo lugar por donde
// pasa cada cambio. En producción es un almacén de solo apéndice, aparte de
// la base de negocio — si quien borró el dato puede borrar su rastro, el
// rastro no protege de nada.
var constructor = WebApplication.CreateBuilder(args);
constructor.Services.AddSingleton<Auditoria>();
var app = constructor.Build();

var tareas = new ConcurrentDictionary<string, Tarea>();
var siguiente = 0;

app.MapPost("/tareas", (Cuerpo? cuerpo, HttpRequest peticion, Auditoria auditoria) =>
{
    var id = Interlocked.Increment(ref siguiente).ToString();
    var tarea = new Tarea(id, cuerpo?.Titulo ?? "");
    tareas[id] = tarea;
    var actor = peticion.Headers["X-Actor"].FirstOrDefault();
    auditoria.Registrar(actor, "crear", "tarea", id);
    return Results.Json(tarea, statusCode: 201);
});

app.MapGet("/tareas/{id}", (string id) =>
    // Leer NO se audita: la auditoría registra cambios.
    tareas.TryGetValue(id, out var tarea)
        ? Results.Json(tarea)
        : Results.Json(new { error = "no-encontrada" }, statusCode: 404));

app.MapDelete("/tareas/{id}", (string id, HttpRequest peticion, Auditoria auditoria) =>
{
    if (!tareas.TryRemove(id, out _))
    {
        return Results.Json(new { error = "no-encontrada" }, statusCode: 404);
    }
    var actor = peticion.Headers["X-Actor"].FirstOrDefault();
    auditoria.Registrar(actor, "borrar", "tarea", id);
    return Results.StatusCode(204);
});

app.MapGet("/auditoria", (Auditoria auditoria) =>
{
    var registros = auditoria.Todos();
    return Results.Json(new { total = registros.Count, registros });
});

app.Run();

record Tarea(string id, string titulo);

record Registro(string actor, string accion, string recurso, string recurso_id, string instante);

class Cuerpo
{
    public string? Titulo { get; set; }
}

class Auditoria
{
    private readonly List<Registro> _registros = new();
    private readonly object _candado = new();

    public void Registrar(string? actor, string accion, string recurso, string id)
    {
        var registro = new Registro(
            string.IsNullOrEmpty(actor) ? "anonimo" : actor,
            accion, recurso, id,
            // El instante lo pone el SERVIDOR, no el cliente.
            DateTime.UtcNow.ToString("o"));
        lock (_candado) { _registros.Add(registro); }
    }

    public List<Registro> Todos()
    {
        lock (_candado) { return new List<Registro>(_registros); }
    }
}
