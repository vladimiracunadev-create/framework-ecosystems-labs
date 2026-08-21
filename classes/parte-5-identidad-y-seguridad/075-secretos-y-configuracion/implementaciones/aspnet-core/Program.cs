// ASP.NET Core lee variables de entorno como una fuente de configuración más,
// a través de IConfiguration. El validador se escribe una vez y lo usan el
// arranque y el endpoint — la misma regla en los dos sitios.
var constructor = WebApplication.CreateBuilder(args);

string[] requeridas = ["APP_ENTORNO", "APP_SECRETO"];

// Devuelve TODAS las que faltan, no la primera: tres despliegues fallidos
// seguidos no son forma de descubrir tres variables sin poner.
List<string> Validar(Func<string, string?> fuente) =>
    requeridas.Where(clave => string.IsNullOrEmpty(fuente(clave))).ToList();

// El arranque usa el mismo validador. Si falta algo, se lanza antes de
// escuchar: fallar al arrancar es no fallar en la primera petición.
var faltanArranque = Validar(clave => constructor.Configuration[clave]);
if (faltanArranque.Count > 0)
{
    throw new InvalidOperationException(
        $"Configuración incompleta, faltan: {string.Join(", ", faltanArranque)}");
}

var entorno = constructor.Configuration["APP_ENTORNO"]!;
var secreto = constructor.Configuration["APP_SECRETO"]!;

var app = constructor.Build();

app.MapGet("/configuracion", () =>
    // El secreto NUNCA sale: presencia, no valor.
    Results.Json(new
    {
        entorno,
        secreto_presente = !string.IsNullOrEmpty(secreto),
        secreto = "****",
    }));

app.MapPost("/validar", (Dictionary<string, string>? cuerpo) =>
{
    var fuente = cuerpo ?? new Dictionary<string, string>();
    var faltan = Validar(clave => fuente.GetValueOrDefault(clave));
    return faltan.Count > 0
        ? Results.Json(new { valida = false, faltan }, statusCode: 422)
        : Results.Json(new { valida = true });
});

app.Run();
