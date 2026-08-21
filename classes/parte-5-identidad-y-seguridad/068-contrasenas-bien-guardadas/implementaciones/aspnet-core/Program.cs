using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// El hasher de Identity: PBKDF2 con sal aleatoria por resumen, y la version
// del formato escrita dentro del propio resumen — verificar no necesita
// configuracion, y subir los parametros manana no rompe los resumenes de
// ayer (VerifyHashedPassword avisa con SuccessRehashNeeded).
var hasher = new PasswordHasher<string>();

// Usuario → resumen. La contrasena en claro no se guarda nunca.
var usuarios = new Dictionary<string, string>();

// Resumen senuelo: verificar contra el cuesta lo mismo que una verificacion
// real, y el tiempo de respuesta no delata que usuarios existen.
var senuelo = hasher.HashPassword("senuelo", "senuelo-que-nunca-coincide");

app.MapPost("/usuarios", (Credenciales? credenciales) =>
{
    var usuario = credenciales?.Usuario ?? "";
    var clave = credenciales?.Clave ?? "";
    if (usuario.Length == 0 || clave.Length == 0)
    {
        return Results.Json(new { error = "faltan-campos" }, statusCode: 422);
    }
    if (usuarios.ContainsKey(usuario))
    {
        return Results.Json(new { error = "ya-existe" }, statusCode: 409);
    }
    var resumen = hasher.HashPassword(usuario, clave);
    usuarios[usuario] = resumen;
    // La ventana de inspeccion del laboratorio: el contrato mide que la misma
    // clave produce resumenes distintos. En produccion no sale.
    return Results.Json(new { usuario, resumen }, statusCode: 201);
});

app.MapPost("/entrar", (Credenciales? credenciales) =>
{
    var usuario = credenciales?.Usuario ?? "";
    var clave = credenciales?.Clave ?? "";
    var resumen = usuarios.TryGetValue(usuario, out var guardado) ? guardado : senuelo;
    var veredicto = hasher.VerifyHashedPassword(usuario, resumen, clave);
    if (veredicto == PasswordVerificationResult.Failed || !usuarios.ContainsKey(usuario))
    {
        // «No existe» y «clave mala» responden igual: distinguirlos regalaria
        // la lista de usuarios.
        return Results.Json(new { error = "credenciales-invalidas" }, statusCode: 401);
    }
    return Results.Json(new { usuario });
});

app.Run();

class Credenciales
{
    [JsonPropertyName("usuario")]
    public string? Usuario { get; set; }

    [JsonPropertyName("clave")]
    public string? Clave { get; set; }
}
