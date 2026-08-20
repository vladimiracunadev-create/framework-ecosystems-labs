var constructor = WebApplication.CreateBuilder(args);

// Los tres ambitos de .NET, con su coste y su riesgo:
//   Singleton  -> uno para todo el proceso
//   Scoped     -> uno por peticion
//   Transient  -> uno por cada vez que se pide
constructor.Services.AddSingleton<ServicioUnico>();
constructor.Services.AddScoped<ServicioPorPeticion>();

var app = constructor.Build();

app.MapGet("/ambitos", (ServicioUnico unico, ServicioPorPeticion porPeticion) =>
    Results.Json(new { unico = unico.Id, porPeticion = porPeticion.Id }));

app.Run();

class ServicioUnico
{
    private static int creados;
    public int Id { get; } = Interlocked.Increment(ref creados);
}

class ServicioPorPeticion
{
    private static int creados;
    public int Id { get; } = Interlocked.Increment(ref creados);
}
