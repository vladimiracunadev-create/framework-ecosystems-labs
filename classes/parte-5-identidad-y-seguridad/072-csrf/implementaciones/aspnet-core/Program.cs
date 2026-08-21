using System.Security.Cryptography;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Antiforgery;

// Aqui la proteccion NO se escribe: se usa el Antiforgery de ASP.NET Core.
// Emite un par —cookie firmada + testigo para el cliente— y ValidateRequestAsync
// comprueba que los dos casan. La pagina del atacante tiene la cookie (el
// navegador la adjunta solo) pero no puede leer el testigo: eso corta el CSRF.
var constructor = WebApplication.CreateBuilder(args);
constructor.Services.AddAntiforgery(opciones =>
{
    opciones.HeaderName = "x-csrf-token";
});

var app = constructor.Build();
app.UseAntiforgery();

var usuarios = new Dictionary<string, string> { ["ana"] = "secreta123" };
var cuentas = new Dictionary<string, int> { ["ana"] = 100 };
// La sesion manual de la clase 066: estado en el servidor, cookie opaca.
var sesiones = new Dictionary<string, string>();

string? UsuarioActual(HttpContext contexto) =>
    contexto.Request.Cookies.TryGetValue("sesion", out var id)
    && sesiones.TryGetValue(id, out var usuario) ? usuario : null;

app.MapPost("/entrar", (Credenciales? credenciales, HttpContext contexto, IAntiforgery antiforgery) =>
{
    var usuario = credenciales?.Usuario ?? "";
    if (!usuarios.TryGetValue(usuario, out var clave) || clave != (credenciales?.Clave ?? ""))
    {
        return Results.Json(new { error = "credenciales-invalidas" }, statusCode: 401);
    }
    var identificador = Convert.ToBase64String(RandomNumberGenerator.GetBytes(24))
        .TrimEnd('=').Replace('+', '-').Replace('/', '_');
    sesiones[identificador] = usuario;
    contexto.Response.Cookies.Append("sesion", identificador, new CookieOptions
    {
        HttpOnly = true,
        SameSite = SameSiteMode.Lax,
        Path = "/",
    });
    // GetAndStoreTokens deja la cookie antiforgery en la respuesta y
    // devuelve el testigo que el cliente debera repetir en el encabezado.
    var testigos = antiforgery.GetAndStoreTokens(contexto);
    return Results.Json(new { usuario, csrf = testigos.RequestToken });
});

app.MapPost("/transferir", async (HttpContext contexto, IAntiforgery antiforgery) =>
{
    var usuario = UsuarioActual(contexto);
    if (usuario is null)
    {
        return Results.Json(new { error = "no-autenticado" }, statusCode: 401);
    }
    try
    {
        // La validacion real: cookie antiforgery + encabezado, los dos o 403.
        await antiforgery.ValidateRequestAsync(contexto);
    }
    catch (AntiforgeryValidationException)
    {
        return Results.Json(new { error = "testigo-invalido" }, statusCode: 403);
    }
    var datos = await contexto.Request.ReadFromJsonAsync<Transferencia>();
    cuentas[usuario] -= datos?.Importe ?? 0;
    return Results.Json(new { saldo = cuentas[usuario] });
});

app.MapGet("/saldo", (HttpContext contexto) =>
{
    var usuario = UsuarioActual(contexto);
    if (usuario is null)
    {
        return Results.Json(new { error = "no-autenticado" }, statusCode: 401);
    }
    // GET no muta y no lleva testigo: la defensa protege las escrituras.
    return Results.Json(new { saldo = cuentas[usuario] });
});

app.Run();

class Credenciales
{
    [JsonPropertyName("usuario")]
    public string? Usuario { get; set; }

    [JsonPropertyName("clave")]
    public string? Clave { get; set; }
}

class Transferencia
{
    [JsonPropertyName("importe")]
    public int Importe { get; set; }
}
