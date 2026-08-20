var constructor = WebApplication.CreateBuilder(args);

// El contenedor viene en la plataforma, no en una biblioteca: registrar el
// contrato y su implementacion es una linea.
constructor.Services.AddSingleton<IReloj, RelojFijo>();

var app = constructor.Build();

// El parametro del manejador se resuelve desde el contenedor: no hay atributo
// ni anotacion que lo pida.
app.MapGet("/ahora", (IReloj reloj) =>
    Results.Json(new { ahora = reloj.Ahora(), origen = "inyectado" }));

app.Run();

interface IReloj
{
    string Ahora();
}

class RelojFijo : IReloj
{
    public string Ahora() => "2026-01-01T00:00:00Z";
}
