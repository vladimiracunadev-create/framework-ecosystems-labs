using System.Collections.Concurrent;
using System.Threading.Channels;

// COLAS DE TRABAJO CON ASP.NET CORE.
//
// De los cuatro, es el único con **una cola de verdad en la biblioteca estándar**:
// `System.Threading.Channels`. No es una pieza del framework web, es del lenguaje,
// y hace exactamente lo que hace falta: una cola con un extremo por el que se
// escribe y otro por el que se lee, con espera sin bloquear.
//
// Y el que lee es un `BackgroundService`: un servicio con ciclo de vida propio,
// que arranca con la aplicación y se para con ella. Eso es lo que en Node es «no
// esperar la promesa» y en Spring es `@Async`, aquí escrito como lo que de verdad
// es: **un consumidor separado del productor**.
//
// Lo que le falta es lo mismo que a los otros tres, y hay que decirlo igual: la
// cola vive en el proceso. Si se reinicia, lo pendiente desaparece.

var constructor = WebApplication.CreateBuilder(args);

// Lo que tarda el trabajo.
const int tardanzaMs = 400;

var trabajos = new ConcurrentDictionary<int, Trabajo>();
var siguienteId = 0;

// LA COLA. Sin límite aquí; en producción, un límite es obligatorio —si se
// encola más rápido de lo que se consume, sin límite se acaba la memoria y con
// límite se rechaza, que es mucho mejor sitio donde fallar.
var cola = Channel.CreateUnbounded<(int Id, string Descripcion)>();

constructor.Services.AddHostedService(_ => new Trabajador(cola.Reader, trabajos, tardanzaMs));

var app = constructor.Build();

app.MapPost("/tareas", async (Peticion peticion) =>
{
    var id = Interlocked.Increment(ref siguienteId);
    var descripcion = string.IsNullOrWhiteSpace(peticion.Descripcion) ? "sin nombre" : peticion.Descripcion;
    trabajos[id] = new Trabajo(id, descripcion, "encolada", null);
    await cola.Writer.WriteAsync((id, descripcion));

    // 202 y no 200: **esto no está hecho**. Y `Location` para que quien pregunta
    // no tenga que inventarse la URL donde mirar.
    return Results.Accepted($"/tareas/{id}", new { id, estado = "encolada" });
});

app.MapGet("/tareas/{id:int}", (int id) =>
    trabajos.TryGetValue(id, out var trabajo)
        ? Results.Json(trabajo)
        : Results.Json(new { error = "no existe" }, statusCode: 404));

app.MapGet("/cola.json", async (HttpContext contexto) =>
{
    var origen = $"http://{contexto.Request.Host}";
    using var cliente = new HttpClient();

    var reloj = System.Diagnostics.Stopwatch.StartNew();
    var encolada = await cliente.PostAsJsonAsync($"{origen}/tareas", new { descripcion = "ventas de marzo" });
    var msHastaLaRespuesta = reloj.ElapsedMilliseconds;
    var creado = await encolada.Content.ReadFromJsonAsync<Creado>();

    var estado = "encolada";
    while (estado != "terminada" && reloj.ElapsedMilliseconds < 5000)
    {
        await Task.Delay(20);
        var actual = await cliente.GetFromJsonAsync<Trabajo>($"{origen}/tareas/{creado!.Id}");
        estado = actual!.Estado;
    }
    var msHastaTerminar = reloj.ElapsedMilliseconds;

    return Results.Json(new
    {
        framework = "aspnet-core",
        estado_de_la_respuesta = (int)encolada.StatusCode,
        tardanza_del_trabajo_ms = tardanzaMs,
        ms_hasta_la_respuesta = msHastaLaRespuesta,
        ms_hasta_terminar = msHastaTerminar,
        la_respuesta_no_espera = msHastaLaRespuesta < tardanzaMs / 2,
        se_pierde_al_reiniciar = true,
        donde_vive_la_cola = "un Channel en la memoria del proceso",
        como_se_encola =
            "un Channel de la biblioteca estandar y un BackgroundService que lo consume: "
            + "productor y consumidor separados de verdad",
        es_paralelismo = true,
        que_haria_falta_en_produccion =
            "una cola fuera del proceso —Azure Service Bus, RabbitMQ, una tabla— para que "
            + "un reinicio no borre lo pendiente y para poder reintentar",
    });
});

app.Run();

/// <summary>El consumidor: arranca con la aplicación y se para con ella.</summary>
public class Trabajador(
    ChannelReader<(int Id, string Descripcion)> lector,
    ConcurrentDictionary<int, Trabajo> trabajos,
    int tardanzaMs) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken testigo)
    {
        // `ReadAllAsync` espera sin gastar procesador y termina solo cuando se
        // cierra la cola o se cancela el testigo. Es la forma correcta de
        // escribir un bucle de trabajador, y la que evita el `while (true)` con
        // `sleep` que casi todo el mundo escribe la primera vez.
        await foreach (var (id, descripcion) in lector.ReadAllAsync(testigo))
        {
            trabajos[id] = trabajos[id] with { Estado = "en curso" };
            await Task.Delay(tardanzaMs, testigo);
            trabajos[id] = trabajos[id] with { Estado = "terminada", Resultado = $"informe de {descripcion}" };
        }
    }
}

public record Trabajo(int Id, string Descripcion, string Estado, string? Resultado);
public record Peticion(string? Descripcion);
public record Creado(int Id, string Estado);
