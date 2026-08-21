using System.Text;
using System.Text.Json.Serialization;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// En produccion, del entorno (clase 075) y de al menos 256 bits.
var clave = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes("clave-de-firma-solo-para-el-laboratorio"));
var usuarios = new Dictionary<string, string> { ["ana"] = "secreta123" };
var manejador = new JsonWebTokenHandler();

app.MapPost("/token", (Credenciales? credenciales) =>
{
    var usuario = credenciales?.Usuario ?? "";
    if (!usuarios.TryGetValue(usuario, out var esperada) || esperada != (credenciales?.Clave ?? ""))
    {
        return Results.Json(new { error = "credenciales-invalidas" }, statusCode: 401);
    }
    var token = manejador.CreateToken(new SecurityTokenDescriptor
    {
        Claims = new Dictionary<string, object> { ["sub"] = usuario },
        Expires = DateTime.UtcNow.AddHours(1),
        SigningCredentials = new SigningCredentials(clave, SecurityAlgorithms.HmacSha256),
    });
    return Results.Json(new { token, tipo = "Bearer", expira_en = 3600 });
});

app.MapGet("/informe", async (HttpContext contexto) =>
{
    var cabecera = contexto.Request.Headers.Authorization.FirstOrDefault() ?? "";
    var token = cabecera.StartsWith("Bearer ") ? cabecera["Bearer ".Length..] : "";

    // Los parametros de validacion FIJAN lo aceptable: solo HS256 (la cabecera
    // del token la escribe el atacante; `alg: none` fue exactamente eso) y
    // sin margen de reloj — el margen por omision es de cinco minutos, y un
    // contrato que mide caducidad tiene que saberlo.
    var resultado = await manejador.ValidateTokenAsync(token, new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        IssuerSigningKey = clave,
        ValidAlgorithms = [SecurityAlgorithms.HmacSha256],
        ClockSkew = TimeSpan.Zero,
    });

    if (!resultado.IsValid)
    {
        // Alterado, caducado, de otra clave o ausente: un solo 401.
        return Results.Json(new { error = "token-invalido" }, statusCode: 401);
    }
    return Results.Json(new { usuario = (string)resultado.Claims["sub"] });
});

app.Run();

class Credenciales
{
    [JsonPropertyName("usuario")]
    public string? Usuario { get; set; }

    [JsonPropertyName("clave")]
    public string? Clave { get; set; }
}
