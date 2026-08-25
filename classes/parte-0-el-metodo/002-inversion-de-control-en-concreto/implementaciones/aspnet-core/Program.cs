// La inversion de control con las dos fases explicitas de ASP.NET Core:
// CONSTRUIR y EJECUTAR. Entre las dos se registran los manejadores; ninguno se
// llama hasta que llega una peticion, y el contador lo demuestra.
var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var veces = 0;

// EL REGISTRO. `MapGet` asocia la ruta con la funcion y la guarda. No la
// ejecuta: si lo hiciera, el primer caso del contrato fallaria.
app.MapGet("/trabajo", () =>
{
    // Interlocked y no `veces++`: el servidor atiende en varios hilos y un
    // incremento no atomico perderia cuentas bajo carga.
    Interlocked.Increment(ref veces);
    return Results.Text("hecho", "text/plain");
});

// La ventana de inspeccion: expone el contador sin tocarlo.
app.MapGet("/invocaciones", () => Results.Json(new { veces = Volatile.Read(ref veces) }));

// `Run` es donde el control cambia de manos. La linea siguiente no se ejecuta
// hasta que el proceso termina.
app.Run();
