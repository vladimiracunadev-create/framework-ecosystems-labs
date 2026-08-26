// TAREAS PROGRAMADAS CON ASP.NET CORE.
//
// .NET no trae un programador de calendario en el framework web: trae
// `PeriodicTimer` y `BackgroundService`, que es «cada tanto» y no «los martes a
// las tres». Para calendarios de verdad, la respuesta de este ecosistema se
// llama Quartz.NET o Hangfire, y las dos traen ya resuelto el cerrojo del que va
// esta clase.
//
// `PeriodicTimer` merece un comentario aparte porque es notablemente mejor que
// el temporizador clásico: **no se solapa**. Si la tarea tarda más que el
// intervalo, el siguiente tic espera en lugar de arrancar encima, que es
// exactamente el fallo que produce trabajos duplicados en la misma instancia.
// Aquí el problema es el otro —dos instancias— y ese no lo resuelve nadie por ti.

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// Cada cuánto se dispara.
const int cadaMs = 100;

// Cuántas veces dispara cada prueba.
const int tics = 5;

// EL CERROJO, CON SU CADUCIDAD.
//
// La caducidad es la parte que convierte un cerrojo en algo operable: sin ella,
// una instancia que muera con el turno cogido deja la tarea parada para siempre,
// y nadie se entera hasta que alguien pregunta por el informe que no llegó.
var candado = new object();
string? duenio = null;
long hasta = 0;

bool IntentarCogerElTurno(string quien, long duracionMs)
{
    lock (candado)
    {
        var ahora = Environment.TickCount64;
        if (duenio is not null && hasta > ahora) return false;
        duenio = quien;
        hasta = ahora + duracionMs;
        return true;
    }
}

async Task Programador(string quien, bool conCerrojo, List<string> ejecuciones)
{
    // `PeriodicTimer` en lugar de un bucle con `Delay`: el intervalo se respeta
    // aunque el trabajo tarde, y los tics no se solapan.
    using var temporizador = new PeriodicTimer(TimeSpan.FromMilliseconds(cadaMs));
    for (var i = 0; i < tics; i++)
    {
        await temporizador.WaitForNextTickAsync();
        if (!conCerrojo || IntentarCogerElTurno(quien, cadaMs - 10))
        {
            lock (ejecuciones) ejecuciones.Add(quien);
        }
    }
}

app.MapGet("/", () => Results.Content(
    "<!DOCTYPE html><html lang=\"es\"><head><meta charset=\"utf-8\">"
    + "<title>Programadas</title></head><body><h1>Tareas programadas</h1>"
    + $"<p data-cada=\"{cadaMs}\" data-instancias=\"2\">dos instancias con el mismo temporizador</p>"
    + "</body></html>", "text/html"));

app.MapGet("/programadas.json", async () =>
{
    // SIN CERROJO: las dos instancias trabajan en cada disparo.
    var sinCerrojo = new List<string>();
    await Task.WhenAll(
        Programador("A", false, sinCerrojo),
        Programador("B", false, sinCerrojo));

    // CON CERROJO: solo una por disparo.
    duenio = null;
    hasta = 0;
    var conCerrojo = new List<string>();
    await Task.WhenAll(
        Programador("A", true, conCerrojo),
        Programador("B", true, conCerrojo));

    return Results.Json(new
    {
        framework = "aspnet-core",
        instancias = 2,
        tics,
        cada_ms = cadaMs,
        sin_cerrojo_ejecuciones = sinCerrojo.Count,
        con_cerrojo_ejecuciones = conCerrojo.Count,
        se_duplica_sin_cerrojo = sinCerrojo.Count == tics * 2,
        no_se_duplica_con_cerrojo = conCerrojo.Count == tics,
        el_cerrojo_caduca = true,
        como_se_programa =
            "PeriodicTimer dentro de un BackgroundService: cada tanto, no los martes a las tres; "
            + "para calendarios, Quartz.NET o Hangfire",
        donde_esta_el_cerrojo =
            "aqui, en memoria; en produccion, una fila de una tabla o lo que traiga Hangfire",
        que_haria_falta_en_produccion =
            "que el cerrojo viva fuera del proceso y que su caducidad sea mayor que lo que tarde la tarea",
    });
});

app.Run();
